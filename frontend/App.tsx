import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { TodoPage } from './src/TodoPage';

const App = () => {
    return (
        <SafeAreaView style={styles.container}>
          <TodoPage />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d0d0d0',
  },
});

export default App;
