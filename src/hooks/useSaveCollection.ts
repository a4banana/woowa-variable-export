import { useCallback } from "preact/hooks";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import toFormattedDate from "../utils/toFormattedDate";
import toKebabCase from "../utils/toKebabCase";
import type { ResolvedCollection } from "../utils/getProcessedVariableCollectionsAsync";

/*
    This hook provides functions to save collections to files.
    
    ! no way to get 'saveAs' completion callback w/ file-saver
    @see https://github.com/eligrey/FileSaver.js/issues/335
*/

type SaveCollection = {
    type: 'SINGLE' 
    collection: ResolvedCollection
    fileName?: string
}

type SaveCollections = {
    type: 'MULTIPLE'
    collection: ReadonlyArray<ResolvedCollection>
    fileName: string
}

type SaveCollectionOptions = SaveCollection | SaveCollections

const useSaveCollection = () => {
    const getJsonBlob = ( collection: ResolvedCollection | ReadonlyArray<ResolvedCollection> ): Blob =>
        new Blob([JSON.stringify( collection )], { type: 'application/json' });

    const getCollecitonJsonFileName = ( collectionName: string ): string =>
        `${ toKebabCase( collectionName ) }-${ toFormattedDate( new Date()) }.json`

    // Save collection to a json file
    const saveCollectionAsJson = useCallback(({
        type,
        collection,
        fileName
    }: SaveCollectionOptions ) => {
            const blob = getJsonBlob( collection );
            const name = type === 'SINGLE'
                ? getCollecitonJsonFileName( fileName ? fileName : collection.name )
                : getCollecitonJsonFileName( fileName );

            saveAs( blob, name );
    }, [])

    // Save collections to a zip file
    const saveCollectionsAsZip = useCallback((
        collections: ReadonlyArray<ResolvedCollection>,
    ) => {
        const addCollectionToZip = ( zip: JSZip, collection: ResolvedCollection ) => {
            const blob = getJsonBlob( collection );
            const name = getCollecitonJsonFileName( collection.name );
            zip.file( name, blob );

            return zip
        }
        
        const zip = collections.reduce( addCollectionToZip, new JSZip());

        zip.generateAsync({ type: 'blob' })
            .then( file => saveAs( file, `all-collections-${ toFormattedDate( new Date()) }.zip` ));
    }, [])

    return {
        saveCollectionAsJson,
        saveCollectionsAsZip
    }
}

export default useSaveCollection