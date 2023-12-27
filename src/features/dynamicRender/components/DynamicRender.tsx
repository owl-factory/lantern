"use client";

import { useMemo } from "react";
import { DynamicContext, DynamicContextContents } from "../context/dynamicContext";
import { FactoryOptions } from "../types/factory";
import { MarkupSource } from "../types/markup";
import { StorageType } from "../types/storage";
import { TargetType } from "../types/targetType";
import { MarkupFactory } from "../utils/markup/factory";
import { StorageFactory } from "../utils/storage/factory";
import { DynamicSheet } from "./DynamicSheet";

export type DynamicRenderProps = {
  id: string;
};

function buildContext(props: DynamicRenderProps) {
  const options: FactoryOptions = buildFactoryOptions(props);

  const markupController = MarkupFactory.build(options);
  const storageController = StorageFactory.build(options);

  const context: DynamicContextContents = {
    markup: markupController,
    storage: storageController,
  };

  return context;
}

/**
 * Creates and displays a Dynamic Render for a single entity
 * @param id - The ID of the entity to render
 */
export function DynamicRender(props: DynamicRenderProps) {
  const context = useMemo(() => buildContext(props), [props.id]);

  return (
    <DynamicContext.Provider value={context}>
      <DynamicSheet />
    </DynamicContext.Provider>
  );
}

/**
 * Takes the props provided to the DynamicRender component and parses them into factory options
 * @param props - The props provided to the DynamicRender component
 * @returns FactoryOptions for building controllers with Factories
 */
function buildFactoryOptions(props: DynamicRenderProps): FactoryOptions {
  const options = {
    targetId: props.id,
    targetType: TargetType.Character,
    storageType: StorageType.LocalStorage,
    markupSource: MarkupSource.Hardcoded,
  };

  return options;
}
