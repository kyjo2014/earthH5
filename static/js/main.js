function bind() {

}


/**
 * canvas渲染
 * 
 */
class render3D {
    constructor() {
        this.render = this.render.bind(this);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 160;
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            canvas: document.querySelector('#stage')
        })
        this.renderer.setClearColor(0xffffff, 0.6)
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
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
        this.scene.add(this.earth);
    }
    addCloud() {
        let cloud_texture = new THREE.TextureLoader().load('tx/cloud.png');
        let cloud_geometry = new THREE.SphereGeometry(31, 32, 32);
        let cloud_material = new THREE.MeshBasicMaterial({
            shininess: 10,
            map: cloud_texture,
            transparent: true,
            opacity: 0.8
        });
        this.cloud = new THREE.Mesh(cloud_geometry, cloud_material);
        this.scene.add(cloud);
    }
    addLight() {
        let light = new THREE.DirectionalLight(0xffffff, 0.1)
        light.position.x = -150
        light.position.y = 150
        light.position.z = 20
       var ambientLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambientLight);
        this.scene.add(light)
    }
    addEvent() {

    }
    render() {
        requestAnimationFrame(this.render);
        // stats.begin();
        this.earth.rotation.y += 0.001;
        // cloud.rotation.y += 0.001;
        // stats.end();
        this.renderer.render(this.scene, this.camera);
    }



}

function init() {
    initStage()
}
init()


function initStage() {
    let stage = new render3D()
    stage.addEarth()
    stage.addLight()
    stage.render()

}