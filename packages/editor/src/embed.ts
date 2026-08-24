// Browser-safe public embed surface for host applications that compose
// Pascal interaction primitives on top of their own Viewer shell.
//
// Keep this entrypoint intentionally narrow: importing it must not pull the
// full Editor shell (and therefore print/export infrastructure such as
// manifold-3d) into an external browser bundle.
export { Grid } from './components/editor/grid'
export { NodeArrowHandles } from './components/editor/node-arrow-handles'
export { MoveTool } from './components/tools/item/move-tool'
export { useRegistryToolContext } from './components/tools/registry-tool-context'
export { getFloorStackPreviewPosition } from './components/tools/shared/floor-stack-preview'
export {
  type PointerSupportSurface,
  resolvePointerSupportSurface,
} from './components/tools/shared/pointer-support-cap'
export { preloadRegistryToolModules, ToolManager } from './components/tools/tool-manager'
export {
  FloorplanPreview,
  type FloorplanPreviewProps,
  type FloorplanPreviewScene,
} from './components/viewer/floorplan-preview'
export { ViewerStage, type ViewerStageProps } from './components/viewer/viewer-stage'
export type { ViewerStageMode } from './components/viewer/viewer-stage-modes'
export { EDITOR_LAYER } from './lib/constants'
export { movementSfxStepKey } from './lib/sfx/movement-tick'
export { triggerSFX } from './lib/sfx-bus'
export { default as useAlignmentGuides } from './store/use-alignment-guides'
export {
  default as useEditor,
  isAlignmentGuideActive,
  isGridSnapActive,
  isMagneticSnapActive,
} from './store/use-editor'
export { default as useInteractionScope } from './store/use-interaction-scope'
