import React, { ErrorInfo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks';
import { useTranslation } from 'react-i18next';

export interface ErrorDetailsProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  onReset(): void;
}

export function ErrorDetails(props: ErrorDetailsProps) {
  const { t } = useTranslation(['common']);
  const { Common, Gutters, Layout, Fonts } = useTheme();
  return (
    <View style={Layout.fill}>
      <View style={[Layout.fill, Gutters.regularHPadding]}>
        {/*<Icon icon="ladybug" size={64} />*/}
        <Text style={Fonts.textLarge}>{t('errorScreen.title')}</Text>
        <Text style={Fonts.textRegular}>
          {t('errorScreen.friendlySubtitle')}
        </Text>
      </View>

      <ScrollView
        style={Layout.fill}
        contentContainerStyle={[
          Layout.fill,
          Layout.colCenter,
          Layout.scrollSpaceBetween,
        ]}
      >
        <Text style={[Fonts.textRegular, Fonts.textError]}>
          {`${props.error}`.trim()}
        </Text>
        <Text selectable style={Fonts.textError}>
          {`${props.errorInfo?.componentStack || ''}`.trim()}
        </Text>
      </ScrollView>

      <TouchableOpacity
        style={[Common.button.outlineRounded, Gutters.regularHMargin]}
        onPress={props.onReset}
      >
        <Text selectable style={Fonts.textError}>
          {t('errorScreen.reset')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
