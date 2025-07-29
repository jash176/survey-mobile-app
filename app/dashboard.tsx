import { Button } from '@/components/ui/Button'
import EmptyListComponent from '@/components/ui/EmptyListComponent'
import { router } from 'expo-router'
import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Dashboard = () => {
  const handleNewSurveyPress = () => {
    router.push("/new-survey")
  }
  return (
    <SafeAreaView className='flex-1 bg-background'>
      <View className='flex-1 bg-background px-4'>
        <View className='flex-row items-center justify-between'>
          <Text className='text-white font-bold text-2xl'>Surveys</Text>
          <Button title='New Survey' onPress={handleNewSurveyPress} />
        </View>
        <FlatList
          data={[]}
          renderItem={({ }) => null}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={() => {
            return (
              <View className='flex-1 justify-center items-center'>
                <View className='mb-10 justify-center items-center'>
                  <Text className='text-white font-bold text-3xl'>No surveys created</Text>
                  <Text className='text-white text-base text-center mt-2'>No surveys have been created yet, create your first one to start collecting feedback.</Text>
                </View>
                <EmptyListComponent />
              </View>
            )
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default Dashboard