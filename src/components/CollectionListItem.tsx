import {
    IconArrowDownCircle32,
    IconButton,
    Stack,
    Text,
    Muted,
    Inline
  } from "@create-figma-plugin/ui";
import { h } from "preact";
import { ResolvedCollection } from "../utils/getProcessedVariableCollectionsAsync";
import useSaveCollection from "../hooks/useSaveCollection";
import styles from './CollectionListItem.module.css';

type CollectionListItemProps = {
    collection: ResolvedCollection
}

export function CollectionListItem({ collection }: CollectionListItemProps ) {
    const { saveCollectionAsJson } = useSaveCollection()
    
    const pluralize = ( word: string, count: number ) =>
        count > 1 ? `${ word }s` : word;

    const metaInfoString = ( word: string, count: number ) => {
        const pluralizedWord = pluralize( word, count )
        if ( count === 0 ) return `No ${ pluralizedWord }` // The length of 'mode' is never 0.
        if ( count === 1 ) return `1 ${ pluralizedWord }`
        return `${ count } ${ pluralizedWord }`
    }

    const clickHandler = () => saveCollectionAsJson({ type: 'SINGLE', collection })

    return (
        <div className={ styles.collectionListItem }>
            <div className={ styles.collectionListItemInfo }>
                <Stack space="extraSmall">
                    <Text>{ collection.name }</Text>
                    <Inline space="extraSmall">
                        <Muted>{ metaInfoString( 'mode', collection.modes.length ) }</Muted>
                        <Muted>{ metaInfoString( 'variable', collection.variables.length ) }</Muted>
                    </Inline>
                </Stack>
            </div>
            <div className={ styles.collectionListItemAction }>
                <IconButton onClick={ clickHandler }>
                    <IconArrowDownCircle32 />
                </IconButton>
            </div>
        </div>
    )
}