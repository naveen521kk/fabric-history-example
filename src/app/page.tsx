"use client";

import React from "react";

import * as fabric from "fabric";
import { FabricCanvasHistory } from "@naveen521kk/fabric-history";

import { Button } from "@/components/ui/button";
import {
  Undo2Icon,
  Redo2Icon,
  DeleteIcon,
  PlusCircle,
  RectangleHorizontal,
} from "lucide-react";

export default function HomePage() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);

  const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null);
  const [history, setHistory] = React.useState<FabricCanvasHistory | null>(
    null
  );

  const [reRenderCount, setReRenderCount] = React.useState(0);

  React.useEffect(() => {
    if (!canvasRef.current) return;
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;

    if (!container) return;

    const { width, height } = container.getBoundingClientRect();

    const canvas = new fabric.Canvas(canvasRef.current);

    const history = new FabricCanvasHistory(canvas, () => {
      setReRenderCount((count) => count + 1);
    });

    history.init();

    canvas.setDimensions({
      width,
      height,
    });

    setCanvas(canvas);
    setHistory(history);

    return () => {
      canvas.dispose();
    };
  }, [canvasRef]);

  console.log(
    reRenderCount,
    history?.canPerformUndo(),
    history?.canPerformRedo()
  );

  return (
    <div
      className="font-[family-name:var(--font-geist-sans)] flex flex-col justify-center items-center w-screen h-screen"
      ref={canvasContainerRef}
    >
      <div className="absolute top-4 left-4 z-50 flex gap-4 flex-row">
        <div key={reRenderCount} className="flex gap-4">
          <Button
            disabled={!history?.canPerformUndo()}
            onClick={() => {
              history?.undo();
            }}
          >
            <Undo2Icon /> Undo
          </Button>
          <Button
            disabled={!history?.canPerformRedo()}
            onClick={() => {
              history?.redo();
            }}
          >
            <Redo2Icon /> Redo
          </Button>
        </div>
        <Button
          onClick={() => {
            history?.clear();
          }}
        >
          <DeleteIcon /> Clear history
        </Button>
        <Button
          onClick={() => {
            canvas?.clear();
          }}
        >
          <DeleteIcon /> Clear canvas
        </Button>
        <Button
          onClick={() => {
            const rect = new fabric.Rect({
              left: 100,
              top: 100,
              fill: "red",
              width: 100,
              height: 100,
            });
            canvas?.add(rect);
          }}
        >
          <RectangleHorizontal /> Rectangle
        </Button>
        <Button
          onClick={() => {
            const circle = new fabric.Circle({
              left: 100,
              top: 100,
              fill: "blue",
              radius: 100,
            });
            canvas?.add(circle);
          }}
        >
          <PlusCircle /> Circle
        </Button>
        <Button
          onClick={() => {
            const activeObjects = canvas?.getActiveObjects();
            if (activeObjects) {
              activeObjects.forEach((object) => {
                canvas?.remove(object);
              });
            }
          }}
        >
          Delete selected
        </Button>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
}
