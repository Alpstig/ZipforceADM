import React, { Component } from 'react'
import { View} from 'react-native'
import { ListItem } from 'react-native-elements'

export default class AuthButtons extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        if (this.props.currentUser) {
            return (
                <View>
                    <ListItem
                        key={0}
                        title={'Logout'}
                        onPress={this.props.onClickLogout}
                        chevron={{ color: '#FC5185' }}
                        bottomDivider
                    />
                </View>
            )
        } else {
            return (
                <View>
                    <ListItem
                        key={0}
                        title={'Login'}
                        onPress={this.props.onClickLogin}
                        chevron={{ color: '#FC5185' }}
                        bottomDivider
                    />
                    <ListItem
                        key={1}
                        title={'Register'}
                        onPress={this.props.onClickRegister}
                        chevron={{ color: '#FC5185' }}
                        bottomDivider
                    />
                </View>
            )
        }
    }
}