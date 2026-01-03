import { z } from 'zod';

import { DeviceServiceType, type DeviceState, DeviceStateSchema } from './Device';

export enum EntityType {
  Room = 'room',
  Scenario = 'scenario',
  Message = 'message',
  Device = 'device',
  DeviceServiceData = 'DeviceServiceData',
}

export enum DeviceModel {
  VENTILATION_SERVICE = 'VENTILATION_SERVICE',
  TRV = 'TRV',
  ROOM_CLIMATE_CONTROL = 'ROOM_CLIMATE_CONTROL',
  HUE_BRIDGE_MANAGER = 'HUE_BRIDGE_MANAGER',
  HUE_LIGHT_ROOM_CONTROL = 'HUE_LIGHT_ROOM_CONTROL',
  RTH2_BAT = 'RTH2_BAT',
}

export enum DeviceStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export const RoomSchema = z.object({
  '@type': z.literal(EntityType.Room),
  id: z.string(),
  iconId: z.string(),
  name: z.string(),
});
export type Room = z.infer<typeof RoomSchema>;

export const DeviceSchema = z.object({
  '@type': z.literal(EntityType.Device),
  rootDeviceId: z.string(),
  id: z.string(),
  deviceServiceIds: z.array(z.enum(DeviceServiceType)),
  manufacturer: z.string(),
  roomId: z.string(),
  deviceModel: z.enum(DeviceModel),
  serial: z.string(),
  profile: z.string(),
  name: z.string(),
  status: z.enum(DeviceStatus),
});
export type Device = z.infer<typeof DeviceSchema>;

export const DeviceServiceSchema = z.object({
  '@type': z.literal(EntityType.DeviceServiceData),
  id: z.string(),
  deviceId: z.string(),
  path: z.string(),
  state: DeviceStateSchema,
});

export type DeviceServiceData<TState extends DeviceState = DeviceState> = {
  [K in keyof z.infer<typeof DeviceServiceSchema>]: K extends 'state' ? TState : z.infer<typeof DeviceServiceSchema>[K];
};

export const DeletionEventSchema = z.object({
  deleted: z.boolean().optional(),
});
export type DeletionEvent = z.infer<typeof DeletionEventSchema>;

export const PollEventSchema = z.intersection(z.union([RoomSchema, DeviceSchema, DeviceServiceSchema]), DeletionEventSchema);
export type PollEvent = z.infer<typeof PollEventSchema>;
