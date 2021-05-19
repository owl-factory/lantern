import { Swatch, Tooltip } from "components/design";
import React from "react";
import { StorageTypeEnum, storageTypes } from "types/enums/storageType";
import { StorageType, StorageUsageItem } from "types/reroll/library";
import { bytesToReadable } from "utilities/bytes";

interface StorageUsageProps {
  maxAllowedStorage: number;
  usage: StorageUsageItem[];
}

/**
 * Renders the storage usage into a progress bar for easy visualization of the used space per
 * storage type and how much is remaining.
 * @param maxAllowedStorage The max allowed storage available in bytes
 * @param usage A list of the storage usage for different types of values
 */
export function StorageUsage(props: StorageUsageProps): JSX.Element {
  let totalBytes = 0;
  const storageUsageBar: JSX.Element[] = [];

  props.usage.forEach((usageItem: any) => {
    totalBytes += usageItem.bytes;
    storageUsageBar.push(
      <StorageSection
        percent={((usageItem.bytes / props.maxAllowedStorage) * 100).toFixed(2)}
        bytes={usageItem.bytes}
        type={usageItem.storageType}
      />
    );
  });

  return (
    <div>
      Storage Used
      <div className="progress">
        {storageUsageBar}
      </div>
      <span style={{float: "right"}}>
        {bytesToReadable(totalBytes)} ({((totalBytes / props.maxAllowedStorage) * 100).toFixed(2)}%) used
      </span>
      <StorageKey/>
    </div>
  );
}

interface StorageSectionProps {
  bytes: number;
  percent: string;
  type: StorageTypeEnum;
}

/**
 * Renders out a single subsection of the Storage usage bar
 * @param bytes The number of bytes to render out
 * @param percent The percent that this section fills up
 * @param type The storage type enum that this information represents
 */
 function StorageSection(props: StorageSectionProps) {
  const storageType = storageTypes[props.type];
  const readableBytes = bytesToReadable(props.bytes);
  const title = `${storageType.name}: ${readableBytes} (${props.percent}%)`;
  return (
    <Tooltip title={title}>
      <div
        className="progress-bar"
        role="progressbar"
        style={{width: `${props.percent}%`, backgroundColor: storageType.color}}
      />
    </Tooltip>
  );
}

/**
 * Renders out the key for understanding the different bar colors and their meaning
 */
 function StorageKey() {
  const storageKeyItems: JSX.Element[] = [];
  const keys = Object.keys(storageTypes);
  keys.forEach((key: string) => {
    storageKeyItems.push(<StorageKeyItem key={key} storageType={storageTypes[parseInt(key)]}/>);
  });
  return (
    <div>
      {storageKeyItems}
    </div>
  );
}

/**
 * Renders a single item in the Storage bar's key.
 * @param storageType The sotrage type with name and color to render into a key
 */
 function StorageKeyItem({ storageType }: { storageType: StorageType }) {
  return (
    <><Swatch color={storageType.color as string} />{storageType.name}</>
  );
}
