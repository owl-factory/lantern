import { registerForm } from "./components/form";
import { registerUi } from "./components/ui";
import { registerUtilities } from "./components/utility";

export { DynamicRender } from "./components/DynamicRender";

// Performs the requisite setup steps for the DynamicRender
registerForm();
registerUi();
registerUtilities();
