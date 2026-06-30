import { Pressable, Text, View } from 'react-native';

export function JeetoPromoBanner() {
  return (
    <Pressable className="mx-lg mb-lg overflow-hidden rounded-xl">
      <View
        className="flex-row items-center justify-between px-lg py-4"
        style={{
          experimental_backgroundImage:
            'linear-gradient(90deg, #0078FF 0%, #c026d3 50%, #e040fb 100%)',
        }}
      >
        <View className="flex-1 pr-md">
          <Text className="mb-1 text-[15px] font-bold leading-5 text-white">
            Played Jeeto Dhan{'\n'}Dhana Dhan?
          </Text>
          <Text className="text-sm font-semibold text-premium">See Winnings &gt;&gt;</Text>
        </View>

        <View className="items-center justify-center rounded-lg bg-white/10 px-3 py-2">
          <Text className="text-[10px] font-extrabold leading-3 text-white">
            JEETO
          </Text>
          <Text className="text-[9px] font-bold leading-3 text-pink-200">
            DHAN DHANA
          </Text>
          <Text className="text-[10px] font-extrabold leading-3 text-white">
            DHAN
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
