import { mount } from "@vue/test-utils";

//import your component
import TreeList from "../TreeList/TreeList.vue";

test("mount component", async () => {
  expect(TreeList).toBeTruthy();

  const wrapper = mount(TreeList);
  expect(wrapper.find('ul').exists()).toBeTruthy();
});