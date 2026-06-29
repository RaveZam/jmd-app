// Runs before each test file. Swaps real dependencies for test-friendly fakes.

// @expo/vector-icons loads fonts asynchronously, which triggers a late setState
// and the "not wrapped in act(...)" warning. Tests don't care how icons look,
// so replace them with a plain element that renders nothing fancy.
jest.mock("@expo/vector-icons", () => {
  const { Text } = require("react-native");
  return new Proxy(
    {},
    {
      get: () => (props) => <Text {...props} />,
    },
  );
});

// `react-native-get-random-values` installs a native crypto.getRandomValues
// polyfill, but there's no native module under Jest. Node's global crypto
// already provides getRandomValues, so the real `uuid` works without it.
jest.mock("react-native-get-random-values", () => ({}));

// The Supabase client can't load under Jest — importing it runs
// `expo-sqlite/localStorage/install`, which needs a native module. It's only
// used by the outbox PUSH path (runOutboxSync); enqueueOutbox never touches it.
// Stub it so importing a service doesn't drag in the real client. Pushing to
// Supabase is out of scope for these integration tests.
jest.mock("@/src/lib/supabase", () => ({ supabase: {} }));
