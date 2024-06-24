export type ResolvedVariable = Pick<Variable, 'name' | 'resolvedType' | 'valuesByMode' | 'scopes' >
export type ResolvedCollection = Pick<VariableCollection, 'name' | 'modes'> & {
    variables: ReadonlyArray<ResolvedVariable>
    createdAt: number
    exportedFrom: string
}

// convert variableIds to variable objects
function getVariablesByIdAsync( variableIds: Array<string> ): Promise<ReadonlyArray<Variable>> {
    const convertVariableIdsToVariableObjects = async ( variableId: string ) =>
        await figma.variables.getVariableByIdAsync( variableId ) as Variable // never fail

    return new Promise( resolve => {
        const variables = variableIds.map( convertVariableIdsToVariableObjects )
        Promise.all( variables ).then( resolve )
    })
}

// conver variables |> filter 'hiddenFromPublishing = true' |> simplify
async function processVariable( variableIds: Array<string> ): Promise<ReadonlyArray<ResolvedVariable>> {
    // get variables by variableIds async
    const variables = await getVariablesByIdAsync( variableIds )

    // filter 'hiddenFromPublishing = true' then simplify
    return variables
        .filter( variable => !variable.hiddenFromPublishing )
        .map(({ name, resolvedType, valuesByMode, scopes }) => (
            {
                name,
                resolvedType,
                valuesByMode,
                scopes
            }
        ))
}

// convert collection |> processVariable |> simplify
async function processCollection({
    name,
    modes,
    variableIds
}: VariableCollection ): Promise<ResolvedCollection> {
    const variables = await processVariable( variableIds )
    const createdAt = Date.now() // 2 version management
    const exportedFrom = figma.root.name

    return {
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
    const resolvedCollections = collections.map( await processCollection )

    return new Promise( resolve =>
        Promise.all( resolvedCollections ).then( resolve )
    )
}
