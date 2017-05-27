function bind() {

}


/**
 * canvas渲染
 * 
 */
class render3D {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 160;
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            canvas: document.querySelector('#stage')
        })
        this.renderer.setClearColor(0xffffff, 0.6)
        this.renderer.render(this.scene, this.camera)
    }
    addEarth() {
        let earthGeo = new THREE.SphereGeometry(30, 30, 30)
        let earthMesh = null
        let earth_texture = new THREE.TextureLoader().load("tx/earth.jpeg");
        let earth_bump = new THREE.TextureLoader().load("tx/bump.jpeg");
        let earth_specular = new THREE.TextureLoader().load("tx/spec.jpeg");
        let earth_material = new THREE.MeshPhongMaterial({
            shininess: 40,
            bumpScale: 1,
            map: earth_texture,
            bumpMap: earth_bump,
            specularMap: earth_specular
        });
        this.earth = new THREE.Mesh(earth_geometry, earth_material);
        this.scene.add(earth);
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
        this.scene.add(light)
    }
    addEvent() {

    }
    render() {
        requestAnimationFrame(this.render);
        stats.begin();
        earth.rotation.y += 0.001;
        cloud.rotation.y += 0.001;
        stats.end();
        this.renderer.render(this.scene, this.camera);
    }



}

function init() {
    initStage()
}
init()


function initStage() {
    new render3D()
}


