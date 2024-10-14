import React, { useCallback, useState } from 'react'
import { ScrollView, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import { Icon, Text } from 'app/components'
import { useColor } from 'app/context'
import { sizing } from 'app/theme'
import { logger } from 'app/utils'

interface DropdownItem {
  key: string
  value: string
}

interface DropdownProps {
  title?: string
  items: DropdownItem[]
  openHeight?: number
  duration?: number
  initialOpen?: boolean
  borderColor?: string
  backgroundColor?: string
  secondaryColor?: string
  textColor?: string
  width?: number
  onPress?: (key: string) => void
}

const ITEM_HEIGHT = 50

const Dropdown: React.FC<DropdownProps> = ({
  backgroundColor,
  borderColor,
  initialOpen = false,
  items,
  onPress,
  openHeight = 200,
  secondaryColor,
  textColor,
  title,
  width,
}) => {
  const { colors } = useColor()
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const dropdownHeight = useSharedValue(initialOpen ? openHeight : 0)

  // Determine the dropdown title
  const displayedTitle = selectedItem || title || items[0].value

  // Filter items to avoid showing the title and selectedItem
  const filteredItems = items.filter(item => item.value !== displayedTitle)

  // Calculate the content height based on the number of filtered items
  const contentHeight = Math.min(filteredItems.length * ITEM_HEIGHT, openHeight) // Assume each item has a height of 50

  // Toggle function to open/close dropdown
  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => {
      dropdownHeight.value = withSpring(prev ? 0 : contentHeight, {
        damping: 40,
        stiffness: 200,
      })
      return !prev
    })
  }, [dropdownHeight, contentHeight])

  // Handle item selection
  const handleSelectItem = (item: DropdownItem) => {
    logger.log('Dropdown selected:', item.value)
    setSelectedItem(item.value)
    toggleDropdown() // Close dropdown after selection
    if (onPress) onPress(item.key) // Pass selected key back to parent
  }

  // Reanimated style for height animation
  const animatedStyle = useAnimatedStyle(() => ({
    height: dropdownHeight.value,
    overflow: 'hidden', // Ensures items are hidden when closed
  }))

  const containerStyles: StyleProp<ViewStyle> = [
    styles.container,
    width ? { width } : {},
    { borderColor: borderColor || colors.border },
  ]

  const headerStyles: StyleProp<ViewStyle> = [
    styles.item,
    {
      alignItems: 'center',
      backgroundColor: secondaryColor || colors.backgroundSecondary,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  ]

  return (
    <View style={containerStyles}>
      {/* Header with selected item or default title */}
      <TouchableOpacity style={headerStyles} onPress={toggleDropdown}>
        <Text preset="h3" weight="semiBold" style={{ color: textColor || colors.text }}>
          {displayedTitle}
        </Text>
        <Icon
          icon={isOpen ? 'chevron-up' : 'chevron-down'}
          library="Ionicons"
          color={textColor || colors.text}
        />
      </TouchableOpacity>

      {/* Animated dropdown list */}
      <Animated.View
        style={[animatedStyle, { backgroundColor: backgroundColor || colors.background }]}>
        {isOpen && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled // Allow for nested scrolling
            style={{ maxHeight: openHeight }} // Ensure the ScrollView has a max height
          >
            {filteredItems.map(item => (
              <TouchableOpacity
                key={item.key}
                style={styles.item}
                onPress={() => handleSelectItem(item)}>
                <Text preset="h3" weight="regular" style={{ color: textColor || colors.text }}>
                  {item.value}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    borderRadius: sizing.radius.lg,
    borderWidth: 1,
    marginVertical: sizing.spacing.xs,
    overflow: 'hidden',
    width: '80%',
  },
  item: {
    flex: 1,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    minHeight: ITEM_HEIGHT,
    paddingHorizontal: sizing.spacing.md,
  },
})

export default Dropdown
