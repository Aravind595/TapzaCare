import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {HomeSection, Theme} from '../types';

interface Props {
  section: HomeSection;
  theme: Theme;
  onItemPress: (title: string) => void;
}

const SectionRenderer = ({section, theme, onItemPress}: Props) => {
  const items = section.items ?? [];

  const backgroundColor =
    section.background?.kind === 'color'
      ? section.background.value
      : theme.surface;

  const sectionStyle = [
    styles.section,
    {backgroundColor},
  ];

  const headingStyle = [
    styles.heading,
    {color: theme.textPrimary},
  ];

  const renderItemImage = (image?: string) => {
    if (!image) {
      return null;
    }

    return (
      <Image
        source={{uri: image}}
        style={styles.itemImage}
        resizeMode="cover"
      />
    );
  };

  switch (section.type) {
    case 'hero_banner':
      return (
        <View
          style={[
            sectionStyle,
            styles.banner,
            {
              backgroundColor:
                section.background?.kind === 'color'
                  ? section.background.value
                  : theme.primary,
            },
          ]}>
          <Text
            style={[
              styles.bannerTitle,
              {color: theme.textPrimary},
            ]}>
            {section.title}
          </Text>

          {!!section.subtitle && (
            <Text
              style={[
                styles.bannerSubtitle,
                {color: theme.textSecondary},
              ]}>
              {section.subtitle}
            </Text>
          )}

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Book appointment"
            style={[
              styles.bannerButton,
              {backgroundColor: theme.surface},
            ]}
            onPress={() => onItemPress('Book Appointment')}>
            <Text
              style={[
                styles.bannerButtonText,
                {color: theme.primary},
              ]}>
              Book Appointment
            </Text>
          </TouchableOpacity>
        </View>
      );

    case 'category_chips':
      return (
        <View style={sectionStyle}>
          <Text style={headingStyle}>{section.title}</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}>
            {items.map(item => (
              <TouchableOpacity
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={item.title}
                style={[
                  styles.chip,
                  {borderColor: theme.primary},
                ]}
                onPress={() => onItemPress(item.title)}>
                <Text style={{color: theme.primary}}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );

    case 'quick_actions':
      return (
        <View style={sectionStyle}>
          <Text style={headingStyle}>{section.title}</Text>

          <View style={styles.grid}>
            {items.map(item => (
              <TouchableOpacity
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={item.title}
                style={[
                  styles.action,
                  {backgroundColor: theme.primary},
                ]}
                onPress={() => onItemPress(item.title)}>
                <Text style={styles.actionText}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );

    case 'service_grid':
      return (
        <View style={sectionStyle}>
          <Text style={headingStyle}>{section.title}</Text>

          <View style={styles.grid}>
            {items.map(item => (
              <TouchableOpacity
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}${
                  item.price !== undefined
                    ? `, ₹${item.price}`
                    : ''
                }`}
                style={[
                  styles.card,
                  {backgroundColor: theme.secondary},
                ]}
                onPress={() => onItemPress(item.title)}>
                {renderItemImage(item.image)}

                <Text
                  style={[
                    styles.cardTitle,
                    {color: theme.textPrimary},
                  ]}>
                  {item.title}
                </Text>

                {item.price !== undefined && (
                  <Text
                    style={[
                      styles.price,
                      {color: theme.accent},
                    ]}>
                    ₹{item.price}
                  </Text>
                )}

                {!!item.badge && (
                  <Text
                    style={[
                      styles.badge,
                      {color: theme.primary},
                    ]}>
                    {item.badge}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );

    case 'doctor_carousel':
      return (
        <View style={sectionStyle}>
          <Text style={headingStyle}>{section.title}</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}>
            {items.map(item => (
              <TouchableOpacity
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`Book appointment with ${item.title}`}
                style={[
                  styles.doctor,
                  {backgroundColor: theme.secondary},
                ]}
                onPress={() => onItemPress('Book Appointment')}>
                {item.image ? (
                  renderItemImage(item.image)
                ) : (
                  <View
                    style={[
                      styles.avatar,
                      {backgroundColor: theme.primary},
                    ]}>
                    <Text style={styles.avatarText}>
                      {item.title.charAt(0)}
                    </Text>
                  </View>
                )}

                <Text
                  style={[
                    styles.cardTitle,
                    {color: theme.textPrimary},
                  ]}>
                  {item.title}
                </Text>

                {!!item.description && (
                  <Text
                    style={[
                      styles.description,
                      {color: theme.textSecondary},
                    ]}>
                    {item.description}
                  </Text>
                )}

                <Text
                  style={[
                    styles.book,
                    {color: theme.primary},
                  ]}>
                  Book Now
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );

    case 'offer_strip':
      return (
        <View
          style={[
            styles.offer,
            {
              backgroundColor:
                section.background?.kind === 'color'
                  ? section.background.value
                  : theme.accent,
            },
          ]}>
          <Text
            style={[
              styles.offerText,
              {color: theme.surface},
            ]}>
            {section.title}
          </Text>
        </View>
      );

    default:
      return null;
  }
};

const styles = StyleSheet.create({
  section: {
    padding: 16,
    marginBottom: 14,
    borderRadius: 14,
  },
  banner: {
    minHeight: 180,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    fontSize: 14,
    marginTop: 8,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 16,
  },
  bannerButtonText: {
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 22,
    marginRight: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  action: {
    width: '48%',
    minHeight: 65,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    width: '48%',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    minHeight: 90,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  price: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  badge: {
    marginTop: 5,
    fontSize: 12,
  },
  doctor: {
    width: 150,
    padding: 14,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    minHeight: 150,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  itemImage: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  book: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  offer: {
    marginBottom: 14,
    padding: 16,
    borderRadius: 12,
  },
  offerText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default SectionRenderer;