import {
  createActorWithConfig,
  useActor as useActorBase,
} from "@caffeineai/core-infrastructure";
import { type Backend, createActor } from "../backend";

export function useActor() {
  return useActorBase<Backend>(
    (canisterId, uploadFile, downloadFile, options) =>
      createActor(canisterId, uploadFile, downloadFile, options),
  );
}
