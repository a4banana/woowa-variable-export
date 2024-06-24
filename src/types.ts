import { EventHandler } from '@create-figma-plugin/utilities'
import type { ResolvedCollection } from './utils/getProcessedVariableCollectionsAsync'

export interface InitHandler extends EventHandler {
    name: 'INIT',
    handler: ( collections: ReadonlyArray<ResolvedCollection> ) => void
}

export interface PrepareExportHandler extends EventHandler {
    name: 'PREPARE_EXPORT',
    handler: () => void
}

export interface ResizePanelHandler extends EventHandler {
    name: 'RESIZE_PANEL',
    handler: ( height: number ) => void
}