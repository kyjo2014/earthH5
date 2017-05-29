

/**
 * canvas渲染
 * 
 */
class render3D {
    constructor() {
        this.render = this.render.bind(this);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 800 / 1600, 1, 1000);
        this.camera.position.z = 200;
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            canvas: document.querySelector('#stage')
        })
        this.renderer.setClearColor(0xffffff, 0.6)
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(800, 1600);
        this.renderer.render(this.scene, this.camera)
    }
    addEarth() {
        let earth_geometry = new THREE.SphereGeometry(31, 32, 32)
        let earth_texture = new THREE.TextureLoader().load("./static/texture/earth.jpeg");
        let earth_bump = new THREE.TextureLoader().load("./static/texture/bump.jpeg");
        let earth_specular = new THREE.TextureLoader().load("./static/texture/spec.jpeg");
        let earth_material = new THREE.MeshPhongMaterial({
            shininess: 40,
            bumpScale: 1,
            map: earth_texture,
            bumpMap: earth_bump,
            specularMap: earth_specular
        });
        this.earth = new THREE.Mesh(earth_geometry, earth_material);
        this.earth.scale.x = 0.6
        this.earth.scale.y = 0.6
        this.earth.scale.z = 0.6
        this.scene.add(this.earth);
    }
    addCloud() {
        let cloud_texture = new THREE.TextureLoader().load('./static/texture/cloud.png');
        let cloud_geometry = new THREE.SphereGeometry(32,32,32);
        let cloud_material = new THREE.MeshBasicMaterial({
            shininess: 10,
            map: cloud_texture,
            transparent: true,
            opacity: 0.8
        });
        this.cloud = new THREE.Mesh(cloud_geometry, cloud_material);
        this.cloud.scale.x = 0.6
        this.cloud.scale.y = 0.6
        this.cloud.scale.z = 0.6
        this.scene.add(this.cloud);
    }
    addLight() {
        let dirlight = new THREE.DirectionalLight(0xffffff, 0.4)
        dirlight.position.x = -150
        dirlight.position.y = 150
        dirlight.position.z = 0
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        this.scene.add(dirlight)
    }
    addEvent() {
    
    }
    render() {
        requestAnimationFrame(this.render);
        // stats.begin();
        this.earth.rotation.y += 0.001;
        this.cloud.rotation.y += 0.002;
        // stats.end();
        this.renderer.render(this.scene, this.camera);
    }
    rotateScene() {
        this.camera.rotation.x += 0.001
        
    }
    rotateEarth(deg) {
        this.earth.rotation.y += deltaX / 300;
        this.earth.rotation.x += deltaY / 300;
    }
    rotateCloud(deg) {
        this.cloud.rotation.y += deltaX / 300;
        this.cloud.rotation.x += deltaY / 300;
    }
    addPoint() {   

    }
    checkAim() {
        
    }



}




class App {

}

function init() {
    initStage()
}
init()


function initStage() {
    let stage = new render3D()
    stage.addEarth()
    stage.addLight()
    stage.addCloud()
    stage.render()

}


function bindEvent() {

}