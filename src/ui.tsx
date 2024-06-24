import {
  Button,
  Container,
  Divider, 
  render,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import {
  InitHandler,
  PrepareExportHandler,
  ResizePanelHandler,
} from "./types";
import { emit, once } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import { CollectionList } from "./components/CollectionList";
import { Header } from "./components/Header";
import type { ResolvedCollection } from "./utils/getProcessedVariableCollectionsAsync";
import useSaveCollection from "./hooks/useSaveCollection";

function VariableExport() {
  const { saveCollectionAsJson, saveCollectionsAsZip } = useSaveCollection()
  const containerRef = useRef<HTMLDivElement>(null);

  const downloadMergedJsonHanlder = () =>
    saveCollectionAsJson({ type: 'MULTIPLE', collection: collections, fileName: 'all-collections' })

  const downloadAllAsZipHandler = () =>
      saveCollectionsAsZip( collections )

  const [ collections, setCollections ] = useState<ReadonlyArray<ResolvedCollection>>([]);

  // ui init
  once<InitHandler>("INIT", function( collections ) {
    setCollections( collections );
  });

  // init collections
  useEffect(() => {
    emit<PrepareExportHandler>("PREPARE_EXPORT");
  }, []);

  // resize UI
  useEffect(() => {
    emit<ResizePanelHandler>("RESIZE_PANEL", containerRef.current!.clientHeight);
  }, [ collections ]);

  return (
    <Container space="medium" ref={ containerRef }>
      <VerticalSpace space="large" />
      <Header />
      <VerticalSpace space="large" />
      <CollectionList collections={ collections } />
      <VerticalSpace space="large" />
      <Button fullWidth secondary onClick={ downloadAllAsZipHandler }>
        Download All as .zip
      </Button>
      <VerticalSpace space="large" />
      <Divider />
      <VerticalSpace space="large" />
      <Button fullWidth onClick={ downloadMergedJsonHanlder }>
        Merge & Download as .json
      </Button>
      <VerticalSpace space="large" />
    </Container>
  );
}

export default render(VariableExport);
