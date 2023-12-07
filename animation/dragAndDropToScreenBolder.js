//@ts-check
import React, {useState} from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Animated,
    PanResponder,
} from 'react-native'
import {Text, GradientBackground, ActivityIndicatorMask} from '@components/base'
import {Colors} from '@styles'
import {StaticImage} from 'components/StaticImage'
import useNoteOverviewScreenSetting from 'use-cases/useNoteOverviewScreenSetting'

const dragButtonSize = 100

/**
 * @param {*} param0
 * @returns
 */
const DragBox = ({containerWidth, containerHeight}) => {
    const leftTop = {x: 0, y: 0}
    const rightTop = {x: containerWidth - dragButtonSize, y: 0}
    const leftBottom = {x: 0, y: containerHeight - dragButtonSize}
    const rightBottom = {
        x: containerWidth - dragButtonSize,
        y: containerHeight - dragButtonSize,
    }
    const widthPivot = containerWidth / 2
    const heightPivot = containerHeight / 2
    let resetPosition = rightBottom

    const pan = new Animated.ValueXY(resetPosition)
    let positionStyle

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, g) => true,
        onPanResponderGrant: (e, g) => {
            pan.extractOffset()
            pan.setValue({x: 0, y: 0})
        },
        onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
            useNativeDriver: false,
        }),
        onPanResponderRelease: (e, g) => {
            const axisX = g.moveX
            const axisY = g.moveY
            pan.flattenOffset()
            const updateResetPosition = () => {
                if (axisX > widthPivot && axisY > heightPivot) {
                    resetPosition = rightBottom
                } else if (axisX > widthPivot && axisY < heightPivot) {
                    resetPosition = rightTop
                } else if (axisX < widthPivot && axisY < heightPivot) {
                    resetPosition = leftTop
                } else if (axisX < widthPivot && axisY > heightPivot) {
                    resetPosition = leftBottom
                }
                return resetPosition
            }
            Animated.spring(pan, {
                toValue: updateResetPosition(),
                useNativeDriver: true,
            }).start()
        },
    })
    const aniStyle = [
        {
            transform: pan.getTranslateTransform(),
        },
        positionStyle,
        styles.box,
    ]
    return <Animated.View {...panResponder.panHandlers} style={aniStyle} />
}

/**
 * @type {React.FunctionComponent<CardProps>}
 */
const Card = ({onPress, category, count}) => {
    /**
     * @type {NoteInfoCategory}
     */
    const noteInfoCategory = {
        today: {
            title: 'Today',
            iconName: 'ic-note-today',
            iconColor: Colors.noteBlue,
        },
        scheduled: {
            title: 'Scheduled',
            iconName: 'ic-note-scheduled',
            iconColor: Colors.noteRed,
        },
        all: {
            title: 'All',
            iconName: 'ic-note-all',
            iconColor: Colors.noteBlack,
        },
        important: {
            title: 'Important',
            iconName: 'ic-note-important',
            iconColor: Colors.noteOrange,
        },
    }
    const iconStyle = [
        styles.icon,
        {backgroundColor: noteInfoCategory[category].iconColor},
    ]
    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <View style={styles.cardIconTitle}>
                <View style={iconStyle}>
                    <StaticImage
                        imageName={noteInfoCategory[category].iconName}
                    />
                </View>
                <Text font="30-bold">{count}</Text>
            </View>
            <Text font="17-500">{noteInfoCategory[category].title}</Text>
        </TouchableOpacity>
    )
}

/**
 * @type {React.FunctionComponent<NavigationInjectedProps>}
 * @param {NavigationInjectedProps} props - screen props
 */
function NoteOverviewScreen({navigation, route}) {
    const {all, important, scheduled, today, isLoading} =
        useNoteOverviewScreenSetting()

    /**
     * @param {NoteCategory} category
     */
    const goToListScreen = category => {
        navigation.navigate('NoteListScreen', {
            category,
        })
    }
    const [containerWidth, setContainerWidth] = useState(0)
    const [containerHeight, setContainerHeight] = useState(0)
    return (
        <>
            <View
                style={styles.container}
                onLayout={event => {
                    const {width, height} = event.nativeEvent.layout
                    setContainerWidth(width)
                    setContainerHeight(height)
                }}>
                <View style={styles.row}>
                    <Card
                        onPress={() => goToListScreen('today')}
                        category="today"
                        count={today}
                    />
                    <Card
                        onPress={() => goToListScreen('scheduled')}
                        category="scheduled"
                        count={scheduled}
                    />
                </View>
                <View style={styles.row}>
                    <Card
                        onPress={() => goToListScreen('all')}
                        category="all"
                        count={all}
                    />
                    <Card
                        onPress={() => goToListScreen('important')}
                        category="important"
                        count={important}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('CreateNoteScreen')
                    }}
                    style={styles.addIconContainer}>
                    {/*@ts-ignore*/}
                    <GradientBackground
                        style={styles.addIcon}
                        colors={['#82B1ED', '#4B3693']}
                        start={{x: 0.0, y: 0}}
                        end={{x: 1, y: 2.0}}>
                        <StaticImage imageName="ic-add-note" />
                    </GradientBackground>
                </TouchableOpacity>
                <DragBox
                    containerWidth={containerWidth}
                    containerHeight={containerHeight}
                />
            </View>
            <ActivityIndicatorMask loading={isLoading} />
        </>
    )
}

export default NoteOverviewScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        // backgroundColor: Colors.secondary,
        backgroundColor: 'green',
        rowGap: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 15,
    },
    card: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 15,
        backgroundColor: Colors.white,
    },
    icon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardIconTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addIconContainer: {
        position: 'absolute',
        right: 16,
        bottom: 30,
        shadowColor: 'rgba(0, 0, 0, 0.16)',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 6,
        shadowOpacity: 1,
    },
    addIcon: {
        width: 54,
        height: 54,
        flex: 0, // unset the flex in GradientBackground
        paddingLeft: 16,
        paddingTop: 10,
        borderRadius: 27,
    },
    box: {
        position: 'absolute',
        width: dragButtonSize,
        height: dragButtonSize,
        backgroundColor: 'red',
    },
})

/**
 * @typedef {import('@bct-taipei/dt-react/lib/types/data').NoteCategory} NoteCategory
 */

/** @typedef {import('../navigation/NoteStack').NoteStackNavigationProps<"NoteOverviewScreen">} ScreenNavigationProp */
/** @typedef {import('../navigation/NoteStack').NoteStackRouteProp<"NoteOverviewScreen">} ScreenRouteProp */
/** @typedef {import('components/StaticImage').ImageNameTypes} ImageNameTypes */
/**
 * @typedef {Object} NavigationInjectedProps
 * @property {ScreenNavigationProp} navigation
 * @property {ScreenRouteProp} route
 */

/**
 * @typedef {Object} CardProps
 * @property {() => void} onPress
 * @property {'today' | 'scheduled' | 'all' | 'important'} category
 * @property {number} count
 */

/**
 * @typedef {Object} CardInfo
 * @property {string} title
 * @property {ImageNameTypes} iconName
 * @property {string} iconColor
 */

/**
 * @typedef {Object} NoteInfoCategory
 * @property {CardInfo} today
 * @property {CardInfo} scheduled
 * @property {CardInfo} all
 * @property {CardInfo} important
 */
