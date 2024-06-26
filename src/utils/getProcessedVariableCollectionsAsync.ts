export type ResolveVariableAlias = VariableAlias & {
    name: string;
    valuesByMode: { [ modeId: string ]: ResolveVariableValue }
    variableCollectionId: string
}

type ResolveVariableValue = boolean | string | number | RGB | RGBA | ResolveVariableAlias | VariableAlias;

export type ResolvedVariable = Pick<Variable, 'name' | 'resolvedType' | 'valuesByMode' | 'scopes' | 'id' | 'variableCollectionId'> & {
    readonly valuesByMode: { [ modeId: string ]: ResolveVariableValue }
}

export type ResolvedCollection = Pick<VariableCollection, 'name' | 'modes' | 'id'> & {
    variables: ReadonlyArray<ResolvedVariable>
    createdAt: number
    exportedFrom: string
}

const convertVariableIdsToVariableObjects = async ( variableId: string ) =>
    await figma.variables.getVariableByIdAsync( variableId ) as Variable // never fail

// convert variableIds to variable objects
function getVariablesByIdAsync( variableIds: Array<string> ): Promise<ReadonlyArray<Variable>> {
    const variables = variableIds.map( convertVariableIdsToVariableObjects )
    return Promise.all( variables )
}

// resolve variable alias
async function resolveAlias( valuesByMode: Variable[ 'valuesByMode' ]): Promise<ResolvedVariable['valuesByMode']> {
    const isVariableAlias = ( value: VariableValue ): value is VariableAlias =>
        typeof value === 'object' && value.hasOwnProperty( 'type' )

    const resolveValuesByMode = Object.entries( valuesByMode )
        .map( async ([ modeId, value ]: [string, VariableValue]) => {
            if ( !isVariableAlias( value )) return { [ modeId ]: value };
            const { name, valuesByMode, variableCollectionId } = await convertVariableIdsToVariableObjects( value.id );
            return { [modeId]: Object.assign( value, { name, valuesByMode, variableCollectionId })};
        })

    const resolvedValuesByMode = await Promise.all( resolveValuesByMode );

    return Object.assign( {}, ...resolvedValuesByMode )
}

async function resolveVariables({
    valuesByMode,
    name,
    resolvedType,
    scopes,
    id,
    variableCollectionId
}: Variable ): Promise<ResolvedVariable> {
    // resolve variable alias
    const resolvedVariables = await resolveAlias( valuesByMode )
    return {
        valuesByMode: resolvedVariables,
        name,
        resolvedType,
        scopes,
        id,
        variableCollectionId
    }
}

// conver variables |> filter 'hiddenFromPublishing = true' |> simplify
async function processVariable( variableIds: Array<string> ): Promise<ReadonlyArray<ResolvedVariable>> {
    // get variables by variableIds async
    const variables = await getVariablesByIdAsync( variableIds )
    const publishedVariables = variables.filter( variable => !variable.hiddenFromPublishing )
    const resolvedVariables = publishedVariables.map( resolveVariables )

    return Promise.all( resolvedVariables )
}

// convert collection |> processVariable |> simplify
async function processCollection({
    name,
    modes,
    variableIds,
    id
}: VariableCollection ): Promise<ResolvedCollection> {
    const variables = await processVariable( variableIds )
    const createdAt = Date.now() // 2 version management
    const exportedFrom = figma.root.name

    return {
        id,
        name,
        modes,
        variables,
        createdAt,
        exportedFrom
    }
}

/**
 * Get variables and simplify the variable collections async.
 *
 * @param collections - Array of variable collections.
 * @returns Promise with an array of simplified variable collections
 * { name, modes, variables, createdAt, exportedFrom }
 *
 */
export async function getProcessedVariableCollectionsAsync(
    collections: Array<VariableCollection>
): Promise<ReadonlyArray<ResolvedCollection>> {
    const resolvedCollections = collections.map( processCollection ) // 갓교영~
    return Promise.all( resolvedCollections )
}
