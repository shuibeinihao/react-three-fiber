import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Login from "./views/Login";
import Animation from "./views/Example/Animation";
import ClickAndHover from "./views/Example/ClickAndHover";
import Gesture from "./views/Example/Gesture";
import LoaderGltf from "./views/Example/LoaderGltf";
import MultiRender from "./views/Example/MultiRender";
import Selection from "./views/Example/Selection";
import Test from "./views/Example/Test";
import Cannon from "./views/Example/Cannon";
import FirstPerson from "./views/Example/FirstPerson";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/animation" element={<Animation />}></Route>
      <Route path="/clickAndHover" element={<ClickAndHover />}></Route>
      <Route path="/gesture" element={<Gesture />}></Route>
      <Route path="/loaderGltf" element={<LoaderGltf />}></Route>
      <Route path="/multiRender" element={<MultiRender />}></Route>
      <Route path="/selection" element={<Selection />}></Route>
      <Route path="/test" element={<Test />}></Route>
      <Route path="/cannon" element={<Cannon />}></Route>
      <Route path="/firstPerson" element={<FirstPerson />}></Route>
    </Routes>
  );
}
