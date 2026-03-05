import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
60,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.set(0,10,35);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera,renderer.domElement);

const light=new THREE.PointLight(0xffffff,2);
light.position.set(20,20,20);
scene.add(light);

const ambient=new THREE.AmbientLight(0xffffff,.4);
scene.add(ambient);

let points=[];

for(let i=0;i<12;i++){

let angle=i*0.6;

points.push(
new THREE.Vector3(
Math.cos(angle)*15,
i*2,
Math.sin(angle)*15
)
);

}

const curve=new THREE.CatmullRomCurve3(points);

const tube=new THREE.Mesh(

new THREE.TubeGeometry(curve,200,.25,8,false),

new THREE.MeshStandardMaterial({
color:0x38bdf8,
emissive:0x38bdf8
})

);

scene.add(tube);

let running=false;
let progress=0;

document.getElementById("playBtn").onclick=()=>{
running=true;
progress=0;
};

document.getElementById("stopBtn").onclick=()=>{
running=false;
};

function animate(){

requestAnimationFrame(animate);

controls.update();

if(running){

progress+=0.001;

if(progress>1) running=false;

let p=curve.getPoint(progress);

let tangent=curve.getTangent(progress);

let offset=new THREE.Vector3(
tangent.z*6,
4,
-tangent.x*6
);

camera.position.lerp(p.clone().add(offset),.05);
controls.target.lerp(p,.05);

}

renderer.render(scene,camera);

}

animate();
