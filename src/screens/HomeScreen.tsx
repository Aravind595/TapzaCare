import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  ActivityIndicator,
  BackHandler,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';

import {
  RootState,
  AppDispatch,
  toggleTheme,
} from '../store/store';

import {normalConfig} from '../config/normalConfig';
import {festivalConfig} from '../config/festivalConfig';
import {getConfig} from '../services/mockApi'
import {HomeConfig} from '../types';

import SectionRenderer from '../components/SectionRenderer';
import BookingScreen from './BookingScreen';
import PrescriptionsScreen from './PrescriptionsScreen';

const HEADER_MAX_HEIGHT = 90;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE =
  HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isFestival = useSelector(
    (state: RootState) => state.app.isFestival,
  );

  const [showBooking, setShowBooking] = useState(false);
  const [showPrescriptions, setShowPrescriptions] = useState(false);
  const [apiConfig, setApiConfig] = useState<HomeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const sectionAnimations = useRef(
    Array.from({length: 20}, () => new Animated.Value(0)),
  ).current;

  // Load home configuration
  useEffect(() => {
    let mounted = true;

    const loadConfig = async () => {
      try {
        setLoading(true);
        setConfigError(false);

        const response = await getConfig();

        if (mounted && response) {
          setApiConfig(response);
        }
      } catch {
        if (mounted) {
          setConfigError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadConfig();

    return () => {
      mounted = false;
    };
  }, []);

  const config = isFestival
    ? festivalConfig
    : apiConfig ?? normalConfig;

  // Status bar
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  // Android hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (showBooking) {
          setShowBooking(false);
          return true;
        }

        if (showPrescriptions) {
          setShowPrescriptions(false);
          return true;
        }

        // Home screen: allow Android's default back behavior
        return false;
      },
    );

    return () => backHandler.remove();
  }, [showBooking, showPrescriptions]);

  // Dynamic theme styles
  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: config.theme.background,
        },
        header: {
          backgroundColor: config.theme.primary,
        },
        logo: {
          color: config.theme.surface,
        },
        location: {
          color: config.theme.surface,
        },
        themeButton: {
          backgroundColor: config.theme.surface,
        },
        themeButtonText: {
          color: config.theme.primary,
        },
        loadingText: {
          color: config.theme.textSecondary,
        },
        errorBanner: {
          backgroundColor: config.theme.secondary,
        },
        errorText: {
          color: config.theme.textPrimary,
        },
      }),
    [config],
  );

  // Header animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const logoSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [23, 18],
    extrapolate: 'clamp',
  });

  const subtitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Section entrance animations
  useEffect(() => {
    sectionAnimations.forEach(animation => {
      animation.stopAnimation();
      animation.setValue(0);
    });

    const animations = config.sections
      .slice(0, sectionAnimations.length)
      .map((_, index) =>
        Animated.timing(sectionAnimations[index], {
          toValue: 1,
          duration: 450,
          delay: index * 100,
          useNativeDriver: true,
        }),
      );

    Animated.stagger(80, animations).start();

    return () => {
      sectionAnimations.forEach(animation => {
        animation.stopAnimation();
      });
    };
  }, [config, sectionAnimations]);

  // Open booking or prescription screen
  const handleItemPress = (title: string) => {
    const normalizedTitle = title.toLowerCase();

    if (
      normalizedTitle.includes('prescription') ||
      normalizedTitle.includes('medicine')
    ) {
      setShowPrescriptions(true);
      return;
    }

    setShowBooking(true);
  };

  // Booking screen
  if (showBooking) {
    return (
      <BookingScreen
        onBack={() => setShowBooking(false)}
      />
    );
  }

  // Prescriptions screen
  if (showPrescriptions) {
    return (
      <PrescriptionsScreen
        onBack={() => setShowPrescriptions(false)}
      />
    );
  }

  // Home screen
  return (
    <SafeAreaView
      style={[styles.container, dynamicStyles.container]}
      edges={['top', 'left', 'right']}>

      <StatusBar
        backgroundColor={config.theme.primary}
        barStyle="light-content"
      />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          dynamicStyles.header,
          {
            height: headerHeight,
          },
        ]}>

        <View style={styles.headerContent}>
          <Animated.Text
            style={[
              styles.logo,
              dynamicStyles.logo,
              {
                fontSize: logoSize,
              },
            ]}>
            Tapza Care
          </Animated.Text>

          <Animated.Text
            style={[
              styles.location,
              dynamicStyles.location,
              {
                opacity: subtitleOpacity,
              },
            ]}>
            {config.theme.festival?.greeting ??
              'Your health partner'}
          </Animated.Text>
        </View>

        {/* Theme toggle */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={
            isFestival
              ? 'Switch to normal theme'
              : 'Switch to festival theme'
          }
          accessibilityState={{selected: isFestival}}
          style={[
            styles.themeButton,
            dynamicStyles.themeButton,
          ]}
          onPress={() => dispatch(toggleTheme())}>
          <Text
            style={[
              styles.themeButtonText,
              dynamicStyles.themeButtonText,
            ]}>
            {isFestival ? 'Normal' : 'Festival'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Loading */}
      {loading && !apiConfig && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={config.theme.primary}
          />

          <Text
            style={[
              styles.loadingText,
              dynamicStyles.loadingText,
            ]}>
            Loading health services...
          </Text>
        </View>
      )}

      {/* Configuration error */}
      {configError && (
        <View
          style={[
            styles.errorBanner,
            dynamicStyles.errorBanner,
          ]}>
          <Text
            style={[
              styles.errorText,
              dynamicStyles.errorText,
            ]}>
            Unable to load latest configuration.
            Showing available content.
          </Text>
        </View>
      )}

      {/* Home sections */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ],
          {
            useNativeDriver: false,
          },
        )}
        contentContainerStyle={styles.scrollContent}>

        {config.sections.map((section, index) => {
          const animation = sectionAnimations[index];

          if (!animation) {
            return (
              <View key={section.id}>
                <SectionRenderer
                  section={section}
                  theme={config.theme}
                  onItemPress={handleItemPress}
                />
              </View>
            );
          }

          const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [25, 0],
          });

          return (
            <Animated.View
              key={section.id}
              style={{
                opacity: animation,
                transform: [{translateY}],
              }}>
              <SectionRenderer
                section={section}
                theme={config.theme}
                onItemPress={handleItemPress}
              />
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  headerContent: {
    flex: 1,
    justifyContent: 'center',
  },

  logo: {
    fontWeight: 'bold',
  },

  location: {
    fontSize: 12,
    marginTop: 3,
  },

  themeButton: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  themeButtonText: {
    fontWeight: '700',
  },

  scrollContent: {
    paddingBottom: 24,
  },

  loadingContainer: {
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },

  loadingText: {
    fontSize: 13,
  },

  errorBanner: {
    padding: 10,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 8,
  },

  errorText: {
    fontSize: 12,
  },
});

export default HomeScreen;