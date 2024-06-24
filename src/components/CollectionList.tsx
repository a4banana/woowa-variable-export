import { Container, Stack } from "@create-figma-plugin/ui";
import { h } from "preact";
import { CollectionListItem } from "./CollectionListItem";
import type { ResolvedCollection } from "../utils/getProcessedVariableCollectionsAsync";

type CollectionListProps = {
    collections: ReadonlyArray<ResolvedCollection>
}

export function CollectionList({ collections }: CollectionListProps ) {
    const renderList = collections.map( collection => (
        <CollectionListItem collection={ collection } />
    ))
    
    return (
        <Container space="extraSmall">
            <Stack space="small">
                { renderList }
            </Stack>
        </Container>
    )
}