import type { PropsWithChildren } from "react";
import { View } from "react-native";
import StyleSheet from "react-native-media-query";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../colors";

const { ids, styles } = StyleSheet.create({
  container: {
    padding: 25,
    "@media (min-width: 800px)": {
      padding: "60px 20%",
    },
  },
});

export const StyledPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <SafeAreaView style={{ backgroundColor: colors.lightGrey, flex: 1 }}>
      <View style={styles.container} dataSet={{ media: ids.container }}>
        {children}
      </View>
    </SafeAreaView>
  );
};
