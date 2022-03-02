export type PopoverArrowDirections =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'any'
  | 'unknown';

export type PopoverSizeConfig = {
  type: 'INHERIT' | 'STRETCH';
} | {
  type: 'CUSTOM';
  popoverSize: {
    width: number;
    height: number;
  };
};

export type PopoverSize = PopoverSizeConfig['type'];
