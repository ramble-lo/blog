import React, {useState, useEffect, useRef, useCallback} from 'react'
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

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height
/**
 * @type {React.FunctionComponent<NavigationScreenProps>}
 * @param {NavigationScreenProps} props - screen props
 */
const SelectPreferredMetricScreen = props => {
    const circles = [
        {
            color: 'red',
        },
        {
            color: 'blue',
        },
        {
            color: 'green',
        },
        {
            color: 'yellow',
        },
        {
            color: 'purple',
        },
        {
            color: 'black',
        },
        {
            color: 'gray',
        },
        {
            color: 'pink',
        },
        {
            color: 'lime',
        },
        {
            color: 'darkgreen',
        },
        {
            color: 'crimson',
        },
        {
            color: 'orange',
        },
        {
            color: 'cyan',
        },
        {
            color: 'navy',
        },
        {
            color: 'indigo',
        },
        {
            color: 'brown',
        },
        {
            color: 'peru',
        },
    ]
    // const Container = styled(Animated.View)`
    //     margin: auto;
    //     width: 200px;
    //     height: 200px;
    //     position: relative;
    //     top: 100px;
    //     `
    const [deltaTheta, setDeltaTheta] = useState(360 / circles.length)
    const [radiusOfCenter, setRadiusOfCenter] = useState(150)
    const [radiusOfOrbiting, setRadiusOfOrbiting] = useState(25)
    const [container, setContainer] = useState({height: 0, width: 0})
    const [deltaAnim, setDeltaAnim] = useState(new Animated.Value(0))
    const offset = () => parseInt(container.width / 2) - radiusOfOrbiting
    return (
        <View style={styles.container}>
            {/* {circles.map((circle, index) => {
          return (
            <Circle
              key={index}
              color={circle.color}
              radius={25}
              style={{
                // left: Math.sin(index*deltaTheta*Math.PI/180 + Math.PI)*radiusOfCenter+offset(),
                // top: Math.cos(index*deltaTheta*Math.PI/180 + Math.PI)*radiusOfCenter+offset(),
              }}
            >
              <Text style={{color: 'white'}}>{index}</Text>
            </Circle>
          )
        })} */}
            {circles.map((v, i) => (
                <View
                    style={[
                        styles.circleStyle,
                        {
                            backgroundColor: v.color,
                            // left: Math.sin((i * deltaTheta * Math.PI) / 180 + Math.PI,) * radiusOfCenter + offset(),
                            // top: Math.cos((i * deltaTheta * Math.PI) / 180 + Math.PI,) * radiusOfCenter + offset(),
                            left: Math.sin((i * deltaTheta * Math.PI) / 180 + Math.PI,) * radiusOfCenter + offset(),
                            top: Math.cos((i * deltaTheta * Math.PI) / 180 + Math.PI,) * radiusOfCenter + offset(),
                        },
                    ]}
                    key={i}
                    radius={25}>
                    <Text>{v.color}</Text>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 'auto',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        left: SCREEN_WIDTH / 2,
        top: SCREEN_HEIGHT / 2,
    },
    circleStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
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
