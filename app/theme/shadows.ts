/* eslint-disable sort-keys-fix/sort-keys-fix */

const shadowSizes = {
  small: {
    elevation: 1,
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  medium: {
    elevation: 4,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2.5,
  },
  large: {
    elevation: 8,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 3.5,
  },
}

const shadowColors = {
  dark: 'rgba(0, 0, 0, 0.3)',
  light: 'rgba(0, 0, 0, 0.1)',
  medium: 'rgba(0, 0, 0, 0.2)',
}

export const shadows = {
  android: {
    small: shadowSizes.small.elevation,
    medium: shadowSizes.medium.elevation,
    large: shadowSizes.large.elevation,
  },
  ios: {
    small: {
      shadowColor: shadowColors.light,
      shadowOffset: shadowSizes.small.shadowOffset,
      shadowOpacity: shadowSizes.small.shadowOpacity,
      shadowRadius: shadowSizes.small.shadowRadius,
    },
    medium: {
      shadowColor: shadowColors.medium,
      shadowOffset: shadowSizes.medium.shadowOffset,
      shadowOpacity: shadowSizes.medium.shadowOpacity,
      shadowRadius: shadowSizes.medium.shadowRadius,
    },
    large: {
      shadowColor: shadowColors.dark,
      shadowOffset: shadowSizes.large.shadowOffset,
      shadowOpacity: shadowSizes.large.shadowOpacity,
      shadowRadius: shadowSizes.large.shadowRadius,
    },
  },
}
