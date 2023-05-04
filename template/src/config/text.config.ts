import React from 'react';
import { Platform, Text, TextInput, TextStyle } from 'react-native';
import { CUSTOM_FONTS, FONT_FILE_SUFFIX } from '../theme/Fonts';

const applyFontProps = (
  TextComp: typeof Text | typeof TextInput,
  maxFontSizeMultiplier = 1.5,
) => {
  // @ts-ignore
  if (!TextComp.defaultProps) {
    // @ts-ignore
    TextComp.defaultProps = {};
  }
  // @ts-ignore
  TextComp.defaultProps.allowFontScaling = true;
  // @ts-ignore
  TextComp.defaultProps.maxFontSizeMultiplier = maxFontSizeMultiplier;
};

const processFontStyles = (style: TextStyle) => {
  if (typeof style === 'undefined') {
    return style;
  }
  let { fontWeight, fontStyle, fontFamily } = style;
  if (CUSTOM_FONTS.findIndex(fontName => fontName === fontFamily) !== -1) {
    fontFamily += FONT_FILE_SUFFIX[fontWeight || 'original'];
    fontWeight = 'normal';
    if (fontStyle === 'italic') {
      fontFamily += 'Italic';
      fontStyle = 'normal';
    }
    return {
      ...style,
      fontStyle,
      fontWeight,
      fontFamily,
    };
  }
  return style;
};

applyFontProps(Text);
applyFontProps(TextInput, 1.2);

// @ts-ignore
const oldRender = Text.render;

// @ts-ignore
Text.render = (...args) => {
  const origin = oldRender.call(this, ...args);
  // RCTVirtualText is being used for LogBox while RCTText is being used for normal text
  if (origin.type === 'RCTVirtualText') {
    return origin;
  }
  const children = origin.props.children;
  if (
    Platform.OS === 'android' && // Only needed on android
    (typeof origin.props.style?.fontFamily !== 'undefined' ||
      typeof children?.props.style?.fontFamily !== 'undefined')
  ) {
    const parentStyle = processFontStyles(origin.props?.style);
    if (typeof children === 'object') {
      const childStyle = processFontStyles(children.props?.style);
      return React.cloneElement(origin, {
        style: parentStyle,
        children: React.cloneElement(children, {
          style: childStyle,
        }),
      });
    }
    return React.cloneElement(origin, {
      style: parentStyle,
    });
  }
  return origin;
};
