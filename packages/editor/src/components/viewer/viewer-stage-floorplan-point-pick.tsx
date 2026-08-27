'use client'

export type ViewerStageFloorplanPointPick = readonly [number, number]
export type ViewerStageFloorplanNodePointPick = Readonly<{
  nodeId: string
  point: ViewerStageFloorplanPointPick
}>

function finitePoint(value: readonly [number, number]): boolean {
  return value.every((entry) => Number.isFinite(entry))
}

export function resolveViewerStageFloorplanPointPick(
  startClient: readonly [number, number],
  endClient: readonly [number, number],
  planPoint: readonly [number, number],
  thresholdPx = 4,
): ViewerStageFloorplanPointPick | null {
  if (
    !finitePoint(startClient) ||
    !finitePoint(endClient) ||
    !finitePoint(planPoint) ||
    !Number.isFinite(thresholdPx) ||
    thresholdPx < 0
  )
    return null

  if (Math.hypot(endClient[0] - startClient[0], endClient[1] - startClient[1]) > thresholdPx)
    return null

  return Object.freeze([planPoint[0], planPoint[1]] as const)
}

export function resolveViewerStageFloorplanNodePointPick(
  startNodeId: string,
  endNodeId: string | null,
  startClient: readonly [number, number],
  endClient: readonly [number, number],
  planPoint: readonly [number, number],
  thresholdPx = 4,
): ViewerStageFloorplanNodePointPick | null {
  const nodeId = startNodeId.trim()
  if (!nodeId || endNodeId !== startNodeId) return null
  const point = resolveViewerStageFloorplanPointPick(startClient, endClient, planPoint, thresholdPx)
  return point ? Object.freeze({ nodeId, point }) : null
}
