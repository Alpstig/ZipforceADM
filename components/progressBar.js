import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View, Animated } from "react-native";

export default class ProgressBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animation: null
        }
    }
    componentDidMount() {
        this.setState({ animation: new Animated.Value(this.props.progress) })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.progress !== this.props.progress) {
            Animated.timing(this.state.animation, {
                toValue: this.props.progress,
                duration: this.props.duration,
                useNativeDriver: false
            }).start();
        }
    }


    render() {
        const { animation } = this.state
        if (!animation) return null

        const {
            height,
            borderColor,
            borderWidth,
            borderRadius,
            barColor,
            fillColor,
            row
        } = this.props;

        const widthInterpolated = animation.interpolate({
            inputRange: [0, 1],
            outputRange: ["0%", "100%"],
            extrapolate: "clamp"
        })
        return (
            <View style={[{ flexDirection: "row", height }, row ? { flex: 1 } : undefined]}>
                <View style={{ flex: 1, borderColor, borderWidth, borderRadius }}>
                    <View
                        style={[StyleSheet.absoluteFill, { backgroundColor: fillColor }]}
                    />
                    <Animated.View
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: widthInterpolated,
                            backgroundColor: barColor
                        }}
                    />
                </View>
            </View>
        )
    }
}

ProgressBar.defaultProps = {
    height: 10,
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 4,
    barColor: "tomato",
    fillColor: "rgba(0,0,0,.5)",
    duration: 100
}