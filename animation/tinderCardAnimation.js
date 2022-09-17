import React, {useEffect, useRef, useCallback} from 'react'
import {
    View,
    StyleSheet,
    Animated,
    Text,
    TouchableOpacity,
    PanResponder,
    Dimensions,
} from 'react-native'

const CARD_WIDTH = 300
const CARD_HEIGHT = 300
const VISIBLE_ITEMS = 3

/**
 * @type {React.FunctionComponent<AnimatedCardProps>}
 * @param {AnimatedCardProps} props -
 */
const Card = ({
    backgroundColor,
    isFirst,
    swipe,
    scrollXAnimated,
    displayIndex,
    cardStackIndex,
    ...rest
}) => {
    const rotate = Animated.multiply(swipe.x, -1).interpolate({
        inputRange: [-100, 0, 100],
        outputRange: ['8deg', '0deg', '-8deg'],
    })

    const agreeOpacity = swipe.x.interpolate({
        inputRange: [25, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    })

    const disagreeOpacity = swipe.x.interpolate({
        inputRange: [-100, -25],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    })

    const animatedCardStyle = isFirst
        ? [...swipe.getTranslateTransform(), {rotate}]
        : []

    const inputRange = [cardStackIndex - 1, cardStackIndex]
    const translateY = scrollXAnimated.interpolate({
        inputRange,
        outputRange: [40, 0],
    })
    const scale = scrollXAnimated.interpolate({
        inputRange,
        outputRange: [0.8, 1],
    })

    const animatedStyles = [
        styles.cardContainer,
        {
            backgroundColor: backgroundColor,
            transform: [{translateY}, {scale}, ...animatedCardStyle],
        },
    ]

    const renderChoice = useCallback(() => {
        return (
            <>
                <Animated.View
                    style={[styles.choiceContainer, {opacity: agreeOpacity}]}>
                    <Text style={{color: 'white', fontSize: 48}}>
                        {'Agree' + displayIndex}
                    </Text>
                </Animated.View>
                <Animated.View
                    style={[
                        styles.choiceContainer,
                        {opacity: disagreeOpacity},
                    ]}>
                    <Text style={{color: 'white', fontSize: 48}}>
                        {'DisAgree' + displayIndex}
                    </Text>
                </Animated.View>
            </>
        )
    }, [agreeOpacity, disagreeOpacity, displayIndex])

    // Here it is determined whether the card should be displayed?
    return cardStackIndex < displayIndex + VISIBLE_ITEMS && cardStackIndex >= displayIndex ? (
        <Animated.View style={animatedStyles} {...rest}>
            {isFirst && renderChoice()}
        </Animated.View>
    ) : null
}

const Footer = ({handleChoice}) => {
    return (
        <>
            <TouchableOpacity onPress={() => handleChoice(1)}>
                <Text>Agree</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleChoice(-1)}>
                <Text>Disagree</Text>
            </TouchableOpacity>
        </>
    )
}

/**
 * @type {React.FunctionComponent<NavigationScreenProps>}
 * @param {NavigationScreenProps} props - screen props
 */
const SelectPreferredMetricScreen = props => {
    const width = Dimensions.get('window').width
    const cardStack = [
        {title: '1', color: 'red'},
        {title: '2', color: 'green'},
        {title: '3', color: 'blue'},
        {title: '4', color: 'yellow'},
        {title: '5', color: 'orange'},
    ]
    const swipe = useRef(new Animated.ValueXY()).current

    const scale = useRef(new Animated.Value(0)).current

    const scrollXAnimated = React.useRef(new Animated.Value(0)).current

    const scrollXIndex = React.useRef(new Animated.Value(0)).current
    const [displayIndex, setDisplayIndex] = React.useState(0)
    const setActiveIndex = useCallback(
        activeIndex => {
            scrollXIndex.setValue(activeIndex)
            setDisplayIndex(activeIndex)
        },
        [scrollXIndex],
    )
    useEffect(() => {
        Animated.spring(scrollXAnimated, {
            toValue: scrollXIndex,
            duration: 200,
            useNativeDriver: true,
        }).start()
    })

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, {dx, dy, y0}) => {
            swipe.setValue({x: dx, y: dy})
        },
        onPanResponderRelease: (_, {dx, dy}) => {
            const direction = Math.sign(dx)
            const isActionActive = Math.abs(dx) > 100

            if (isActionActive) {
                Animated.timing(swipe, {
                    duration: 200,
                    toValue: {
                        x: direction * 500,
                        y: dy,
                    },
                    useNativeDriver: true,
                }).start(removeTopCard)
                if (direction === 1) {
                    console.log('agree')
                } else {
                    console.log('disagree')
                }
            } else {
                Animated.spring(swipe, {
                    toValue: {
                        x: 0,
                        y: 0,
                    },
                    useNativeDriver: true,
                    friction: 5,
                }).start()
            }
        },
    })

    const removeTopCard = useCallback(() => {
        // setCardArray(preState => preState.slice(1))
        setActiveIndex(displayIndex + 1)
        swipe.setValue({x: 0, y: 0})
    }, [displayIndex, setActiveIndex, swipe])

    const handleChoice = useCallback(
        direction => {
            Animated.timing(swipe.x, {
                toValue: direction * (width + 0.5 * width),
                duration: 400,
                useNativeDriver: true,
            }).start(removeTopCard)
        },
        [removeTopCard, swipe.x, width],
    )

    return (
        <View style={styles.container}>
            <View style={styles.cardStack}>
                {cardStack
                    .map((value, index) => {
                        const isFirst = index === displayIndex
                        const dragHandler = isFirst
                            ? panResponder.panHandlers
                            : {}
                        return (
                            <Card
                                backgroundColor={value.color}
                                isFirst={isFirst}
                                swipe={swipe}
                                cardStackIndex={index}
                                scale={scale}
                                scrollXAnimated={scrollXAnimated}
                                displayIndex={displayIndex}
                                key={index.toString()}
                                {...dragHandler}
                            />
                        )
                    })
                    .reverse()}
            </View>
            <Footer handleChoice={handleChoice} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardStack: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginBottom: 60,
    },
    cardContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    cardContenr: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    choiceContainer: {
        position: 'absolute',
    },
})

export default SelectPreferredMetricScreen

/**
 * @template ItemT
 * @typedef {Omit<import('react-native').GestureResponderHandlers<ItemT>, "data"> & AnimatedProps<ItemT> } AnimatedCardProps
 **/

/**
 * @template ItemT
 * @typedef AnimatedProps
 * @property {string} backgroundColor
 * @property {import('react-native').Animated.ValueXY} swipe
 * @property {any} scale
 */
