import { emit, showUI, on } from '@create-figma-plugin/utilities'
import { PrepareExportHandler, ResizePanelHandler } from './types'
import { getProcessedVariableCollectionsAsync } from './utils/getProcessedVariableCollectionsAsync';

const PANEL_WIDTH = 240;

export default function () {
    on<PrepareExportHandler>('PREPARE_EXPORT', async function () {
        const collections: Array<VariableCollection> = await figma.variables.getLocalVariableCollectionsAsync();
        const processedCollections = await getProcessedVariableCollectionsAsync( collections );

        emit( 'INIT', processedCollections )
    })

    on<ResizePanelHandler>('RESIZE_PANEL', function ( height ) {
        figma.ui.resize( PANEL_WIDTH, height )
    })

    showUI({
        height: 380,
        width: PANEL_WIDTH
    })
}
