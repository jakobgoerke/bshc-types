import { z } from 'zod';

// https://github.com/colinhacks/zod/discussions/839#discussioncomment-10651593
function zObjectKeys<T extends Record<string, any>>(obj: T) {
  const keys = Object.keys(obj) as Extract<keyof T, string>[];
  return z.enum(keys as [Extract<keyof T, string>, ...Extract<keyof T, string>[]]);
}

export const TemperatureLevelStateSchema = z.object({
  '@type': z.literal('temperatureLevelState'),
  temperature: z.number(),
});
export type TemperatureLevelState = z.infer<typeof TemperatureLevelStateSchema>;

export const VentilationDelayStateSchema = z.object({
  '@type': z.literal('ventilationDelayState'),
  delay: z.number(),
});
export type VentilationDelayState = z.infer<typeof VentilationDelayStateSchema>;

export const ThermostatStateSchema = z.object({
  '@type': z.literal('childLockState'),
  childLock: z.enum(['ON', 'OFF']),
});
export type ThermostatState = z.infer<typeof ThermostatStateSchema>;

export const HumidityLevelStateSchema = z.object({
  '@type': z.literal('humidityLevelState'),
  humidity: z.number(),
});
export type HumidityLevelState = z.infer<typeof HumidityLevelStateSchema>;

export const ValveTappetStateSchema = z.object({
  '@type': z.literal('valveTappetState'),
  position: z.number(),
  value: z.enum(['VALVE_ADAPTION_SUCCESSFUL', 'RANGE_TOO_BIG']),
});
export type ValveTappetState = z.infer<typeof ValveTappetStateSchema>;

export const SilentModeStateSchema = z.object({
  '@type': z.literal('silentModeState'),
  mode: z.literal('MODE_SILENT'),
});
export type SilentModeState = z.infer<typeof SilentModeStateSchema>;

export const TemperatureOffsetStateSchema = z.object({
  '@type': z.literal('temperatureOffsetState'),
  maxOffset: z.number(),
  minOffset: z.number(),
  offset: z.number(),
  stepSize: z.number(),
});
export type TemperatureOffsetState = z.infer<typeof TemperatureOffsetStateSchema>;

export enum ThermostatSupportedControlMode {
  HEATING = 'HEATING',
  OFF = 'OFF',
}

export const ThermostatSupportedControlModeStateSchema = z.object({
  '@type': z.literal('thermostatSupportedControlModeState'),
  supportedControlModes: z.array(zObjectKeys(ThermostatSupportedControlMode)),
});
export type ThermostatSupportedControlModeState = z.infer<typeof ThermostatSupportedControlModeStateSchema>;

export enum TemperatureLevel {
  ECO = 'ECO',
  COMFORT = 'COMFORT',
}

export const TemperatureLevelSwitchPointValueStateSchema = z.object({
  '@type': z.literal('temperatureLevelSwitchPointValue'),
  temperatureLevel: zObjectKeys(TemperatureLevel),
});
export type TemperatureLevelSwitchPointValueState = z.infer<typeof TemperatureLevelSwitchPointValueStateSchema>;

export const BinarySwitchStateSchema = z.object({
  '@type': z.literal('binarySwitchState'),
  on: z.boolean(),
});
export type BinarySwitchState = z.infer<typeof BinarySwitchStateSchema>;

export const MultiLevelSwitchStateSchema = z.object({
  '@type': z.literal('multiLevelSwitchState'),
  level: z.number(),
});
export type MultiLevelSwitchState = z.infer<typeof MultiLevelSwitchStateSchema>;

export const PowerMeterStateSchema = z.object({
  '@type': z.literal('powerMeterState'),
  energyConsumption: z.number(),
  powerConsumption: z.number(),
  energyConsumptionStartDate: z.coerce.date(),
});
export type PowerMeterState = z.infer<typeof PowerMeterStateSchema>;

export enum Days {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum OperationMode {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL',
}

export const RoomClimateControlStateSchema = z.object({
  '@type': z.literal('climateControlState'),
  boostMode: z.boolean(),
  low: z.boolean(),
  operationMode: z.nativeEnum(OperationMode),
  roomControlMode: z.nativeEnum(ThermostatSupportedControlMode),
  setpointTemperature: z.number(),
  setpointTemperatureForLevelComfort: z.number(),
  setpointTemperatureForLevelEco: z.number(),
  summerMode: z.boolean(),
  supportsBoostMode: z.boolean(),
  ventilationMode: z.boolean(),
  schedule: z.object({
    profiles: z.array(
      z.object({
        day: z.nativeEnum(Days),
        switchPoints: z.array(
          z.object({
            startTimeMinuts: z.number(),
            value: TemperatureLevelSwitchPointValueStateSchema,
          })
        ),
      })
    ),
  }),
});
export type RoomClimateControlState = z.infer<typeof RoomClimateControlStateSchema>;

export enum DeviceServiceType {
  TemperatureLevel = 'TemperatureLevel',
  VentilationDelay = 'VentilationDelay',
  Thermostat = 'Thermostat',
  ValveTappet = 'ValveTappet',
  SilentMode = 'SilentMode',
  TemperatureOffset = 'TemperatureOffset',
  ThermostatSupportedControlMode = 'ThermostatSupportedControlMode',
  RoomClimateControl = 'RoomClimateControl',
  BinarySwitch = 'BinarySwitch',
  MultiLevelSwitch = 'MultiLevelSwitch',
  HumidityLevel = 'HumidityLevel',
}

export const DeviceStateSchema = z.discriminatedUnion('@type', [
  TemperatureLevelStateSchema,
  VentilationDelayStateSchema,
  ThermostatStateSchema,
  HumidityLevelStateSchema,
  ValveTappetStateSchema,
  SilentModeStateSchema,
  TemperatureOffsetStateSchema,
  ThermostatSupportedControlModeStateSchema,
  RoomClimateControlStateSchema,
  BinarySwitchStateSchema,
  MultiLevelSwitchStateSchema,
  TemperatureLevelSwitchPointValueStateSchema,
  PowerMeterStateSchema,
]);
export type DeviceState = z.infer<typeof DeviceStateSchema>;
