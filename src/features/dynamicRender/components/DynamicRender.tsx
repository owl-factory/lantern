"use client";

import { useEffect, useMemo } from "react";

import { DynamicSheet } from "./DynamicSheet";
import { observer } from "lib/mobx";
import { DynamicContext } from "features/dynamicRender/context/dynamicContext";
import { StateContext } from "features/dynamicRender/context/stateContext";
import { MarkupSource } from "features/dynamicRender/types/controllers/loader";
import { MarkupServeType } from "features/dynamicRender/types/controllers/markup";
import { StorageType } from "features/dynamicRender/types/controllers/storage";
import { FactoryOptions } from "features/dynamicRender/types/factory";
import { TargetType } from "features/dynamicRender/types/targetType";
import { RenderController } from "features/dynamicRender/utils/renderController";
import { StateController } from "features/dynamicRender/utils/stateController";

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
  const context = new RenderController(options);

  return context;
}

/**
 * Creates and displays a Dynamic Render for a single entity
 * @param id - The ID of the entity to render
 */
function _DynamicRender(props: DynamicRenderProps) {
  const context = useMemo(() => buildContext(props), [props.id]);
  const state = useMemo(() => new StateController(), [props.id]);

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
      <StateContext.Provider value={state}>
        <DynamicSheet />
      </StateContext.Provider>
    </DynamicContext.Provider>
  );
}

/** {@inheritdoc _DyanmicRender} */
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
