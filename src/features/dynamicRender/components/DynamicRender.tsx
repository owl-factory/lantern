"use client";

import { useEffect, useMemo } from "react";
import { DynamicContext } from "../context/dynamicContext";
import { FactoryOptions } from "../types/factory";
import { MarkupServeType, MarkupSource } from "../types/markup";
import { StorageType } from "../types/storage";
import { TargetType } from "../types/targetType";
import { DynamicSheet } from "./DynamicSheet";
import { ContextController } from "../utils/contextController";
import { observer } from "lib/mobx";

export type DynamicRenderProps = {
  id: string;
};

/**
 * Creates a Context Controller for use within the Dynamic Render
 * @param props - The Dynamic Render props to convert into Factory Options
 * @returns A Context Controller
 */
function buildContext(props: DynamicRenderProps) {
  const options: FactoryOptions = buildFactoryOptions(props);
  const context = new ContextController(options);

  return context;
}

/**
 * Creates and displays a Dynamic Render for a single entity
 * @param id - The ID of the entity to render
 */
function _DynamicRender(props: DynamicRenderProps) {
  const context = useMemo(() => buildContext(props), [props.id]);

  useEffect(() => {
    if (context === undefined) return;

    context.load();
    return () => {
      context.unload();
    };
  }, [context]);

  if (!context.ready) {
    return <>Loading!</>;
  }

  return (
    <DynamicContext.Provider value={context}>
      <DynamicSheet />
    </DynamicContext.Provider>
  );
}

export const DynamicRender = observer(_DynamicRender);

/**
 * Takes the props provided to the DynamicRender component and parses them into factory options
 * @param props - The props provided to the DynamicRender component
 * @returns FactoryOptions for building controllers with Factories
 */
function buildFactoryOptions(props: DynamicRenderProps): FactoryOptions {
  const options: FactoryOptions = {
    targetId: props.id,
    targetType: TargetType.Character,
    storageType: StorageType.LocalStorage,
    markupServeType: MarkupServeType.Static,

    markupSource: MarkupSource.Hardcoded,
    uri: "/characters/mockfinder.xml",
  };

  return options;
}
