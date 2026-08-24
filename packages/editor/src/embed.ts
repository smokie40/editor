// Browser-safe public embed surface for host applications that compose
// Pascal interaction primitives on top of their own Viewer shell.
//
// Keep this entrypoint intentionally narrow: importing it must not pull the
// full Editor shell (and therefore print/export infrastructure such as
// manifold-3d) into an external browser bundle.
export { Grid } from './components/editor/grid'
export { MoveTool } from './components/tools/item/move-tool'
export { NodeArrowHandles } from './components/editor/node-arrow-handles'
export { preloadRegistryToolModules, ToolManager } from './components/tools/tool-manager'
export {
  FloorplanPreview,
  type FloorplanPreviewProps,
  type FloorplanPreviewScene,
} from './components/viewer/floorplan-preview'
export { ViewerStage, type ViewerStageProps } from './components/viewer/viewer-stage'
export type { ViewerStageMode } from './components/viewer/viewer-stage-modes'
export { default as useEditor } from './store/use-editor'
