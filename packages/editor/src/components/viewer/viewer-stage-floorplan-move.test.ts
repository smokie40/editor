import { describe, expect, test } from 'bun:test'
import { resolveViewerStageFloorplanMove } from './viewer-stage-floorplan-move'

describe('viewer stage floorplan host move', () => {
  test('returns a plan-local delta after the drag threshold', () => {
    expect(
      resolveViewerStageFloorplanMove(
        'light-1',
        [10, 10],
        [20, 14],
        [1, 2],
        [1.5, 3],
      ),
    ).toEqual({ nodeId: 'light-1', delta: [0.5, 1] })
  })

  test('treats short pointer motion as selection instead of a move', () => {
    expect(
      resolveViewerStageFloorplanMove(
        'light-1',
        [10, 10],
        [12, 12],
        [1, 2],
        [2, 3],
      ),
    ).toBeNull()
  })

  test('fails closed on invalid coordinates or identity', () => {
    expect(
      resolveViewerStageFloorplanMove(
        'light-1',
        [10, 10],
        [20, 20],
        [1, 2],
        [Number.NaN, 3],
      ),
    ).toBeNull()
    expect(
      resolveViewerStageFloorplanMove(
        '',
        [10, 10],
        [20, 20],
        [1, 2],
        [2, 3],
      ),
    ).toBeNull()
  })
})
