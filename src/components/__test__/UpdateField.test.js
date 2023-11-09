import { mount } from "@vue/test-utils";

//import your component
import UpdateField from "../TreeList/UpdateField.vue";

test("mount component with props", async () => {
  function updatePost(){};
  function errorMessages(){};
  expect(UpdateField).toBeTruthy();
  const wrapper = mount(UpdateField, {
    props: {
      type: 'author',
    },
    global: {
      provide: {
        updatePost: {
          updatePost,
          errorMessages
        }
      }
    }
  });
  expect(wrapper.find('span.title').text()).toBe('✍🏼');
});