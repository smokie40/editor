'use client'

import { useEffect, useRef } from 'react'
import {
  resolveViewerStageFloorplanNodePointPick,
  resolveViewerStageFloorplanPointPick,
} from './viewer-stage-floorplan-point-pick'

type Point = readonly [number, number]
type Active = {
  pointerId: number
  preview: SVGSVGElement
  startClient: Point
  startPlan: Point
  nodeId: string | null
}

function floorplanScene(preview: SVGSVGElement): SVGGElement | null {
  for (const child of Array.from(preview.children)) {
    if (child instanceof SVGGElement) return child
  }
  return null
}

function floorplanNodeId(target: Element): string | null {
  const node = target.closest('[data-floorplan-node-id]')
  const id = node?.getAttribute('data-floorplan-node-id')?.trim()
  return id ? id : null
}

function toPlan(scene: SVGGElement, clientX: number, clientY: number): Point | null {
  const svg = scene.ownerSVGElement
  const ctm = scene.getScreenCTM()
  if (!(svg && ctm)) return null
  const point = svg.createSVGPoint()
  point.x = clientX
  point.y = clientY
  const local = point.matrixTransform(ctm.inverse())
  return Number.isFinite(local.x) && Number.isFinite(local.y) ? [local.x, local.y] : null
}

export function ViewerStageFloorplanPointPickBridge({
  onPlanNodePointPick,
  onPlanPointPick,
  root,
}: {
  onPlanNodePointPick?: (nodeId: string, point: Point) => void
  onPlanPointPick?: (point: Point) => void
  root: HTMLElement | null
}) {
  const nodeCallbackRef = useRef(onPlanNodePointPick)
  const pointCallbackRef = useRef(onPlanPointPick)
  const activeRef = useRef<Active | null>(null)
  nodeCallbackRef.current = onPlanNodePointPick
  pointCallbackRef.current = onPlanPointPick

  useEffect(() => {
    if (!root) return

    const cancel = () => {
      activeRef.current = null
    }
    const down = (event: PointerEvent) => {
      if (event.button !== 0 || !(event.target instanceof Element)) return
      const nodeId = floorplanNodeId(event.target)
      if (nodeId ? !nodeCallbackRef.current : !pointCallbackRef.current) return
      const preview = event.target.closest('[data-floorplan-preview]')
      if (!(preview instanceof SVGSVGElement) || !root.contains(preview)) return
      const scene = floorplanScene(preview)
      if (!scene) return
      const startPlan = toPlan(scene, event.clientX, event.clientY)
      if (!startPlan) return
      activeRef.current = {
        pointerId: event.pointerId,
        preview,
        startClient: [event.clientX, event.clientY],
        startPlan,
        nodeId,
      }
    }
    const up = (event: PointerEvent) => {
      const active = activeRef.current
      if (!active || active.pointerId !== event.pointerId) return
      activeRef.current = null
      const rect = active.preview.getBoundingClientRect()
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      if (!inside || !(event.target instanceof Element)) return

      const endClient = [event.clientX, event.clientY] as const
      const endNodeId = floorplanNodeId(event.target)
      if (active.nodeId) {
        const pick = resolveViewerStageFloorplanNodePointPick(
          active.nodeId,
          endNodeId,
          active.startClient,
          endClient,
          active.startPlan,
        )
        if (pick) nodeCallbackRef.current?.(pick.nodeId, pick.point)
        return
      }
      if (endNodeId) return
      const point = resolveViewerStageFloorplanPointPick(
        active.startClient,
        endClient,
        active.startPlan,
      )
      if (point) pointCallbackRef.current?.(point)
    }
    const pointerCancel = (event: PointerEvent) => {
      if (activeRef.current?.pointerId === event.pointerId) cancel()
    }
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeRef.current) cancel()
    }

    root.addEventListener('pointerdown', down, true)
    window.addEventListener('pointerup', up, true)
    window.addEventListener('pointercancel', pointerCancel, true)
    window.addEventListener('keydown', key, true)
    return () => {
      root.removeEventListener('pointerdown', down, true)
      window.removeEventListener('pointerup', up, true)
      window.removeEventListener('pointercancel', pointerCancel, true)
      window.removeEventListener('keydown', key, true)
      cancel()
    }
  }, [root])

  return null
}
