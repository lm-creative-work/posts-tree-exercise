import { mount } from "@vue/test-utils";

//import your component
import TreeListItem from "../TreeList/TreeListItem.vue";

test("mount component with title prop", async () => {
  expect(TreeListItem).toBeTruthy();
  const wrapper = mount(TreeListItem, {
    props: {
      title: 'Tree List Items',
    },
  });
  expect(wrapper.find('.title').text()).toBe('Tree List Items');
});