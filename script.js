document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.getElementById('image');
            imgElement.src = e.target.result;
            imgElement.onload = function() {
                detectObjects();
            };
        };
        reader.readAsDataURL(file);
    }
});

const commonObjects = [
    "chair", "table", "phone", "computer", "book", "pen", "mug", "lamp", "glasses", "car", "watch", "phone charger", "television",
    "refrigerator", "pillow", "blanket", "shoes", "hat", "wallet", "keys", "bag", "shirt", "pants", "jacket", "mirror", "clock",
    "couch", "bed", "toothbrush", "toothpaste", "towel", "umbrella", "backpack", "notebook", "laptop", "headphones", "camera",
    "bottle", "glass", "plate", "fork", "knife", "spoon", "hairbrush", "comb", "sunglasses", "slippers", "belt", "scissors",
    "screwdriver", "hammer", "drill", "paintbrush", "cup", "flashlight", "candle", "remote control", "radio", "microwave",
    "oven", "blender", "toaster", "building", "vacuum cleaner", "iron", "washing machine", "dryer", "ruler", "stapler", "tape dispenser",
    "paperclip", "binder", "calculator", "calendar", "picture frame", "plant", "vase", "alarm clock", "fan", "heater",
    "air conditioner", "thermometer", "scale", "medicine bottle", "soap", "shampoo", "conditioner", "razor", "hair dryer",
    "printer", "usb drive", "mouse", "keyboard", "monitor", "speaker", "dvd player", "game console", "remote", "shelf",
    "basket", "drawer", "cabinet", "rug", "carpet", "blanket", "pillowcase", "bedspread", "sheet", "pot", "pan", "cutting board",
    "oven mitt", "tupperware", "can opener", "whisk", "colander", "sieve", "grater", "peeler", "corkscrew", "bottle opener",
    "thermos", "lunchbox", "travel mug", "ice cube tray", "egg timer", "tea kettle", "fire extinguisher", "first aid kit",
    "ladder", "toolbox", "drill bit", "nails", "screws", "bolts", "nuts", "washcloth", "plunger", "broom", "dustpan",
    "mop", "bucket", "sponge", "vacuum", "scissors", "rake", "shovel", "hoe", "trowel", "pruning shears", "spade", "fork",
    "garden gloves", "watering can", "hose", "thermometer", "glue gun", "wrench", "screwdriver", "pliers", "level", "tape measure",
    "nutcracker", "egg separator", "apple corer", "citrus juicer", "pizza cutter", "mandolin slicer", "pepper grinder",
    "salt shaker", "sugar bowl", "butter dish", "breadbox", "cookie jar", "tea infuser", "spice rack", "measuring cups", "measuring spoons"
];

async function detectObjects() {
    const image = document.getElementById('image');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to the image dimensions
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the image on canvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Load the COCO-SSD model
    const model = await cocoSsd.load();

    // Perform object detection
    const predictions = await model.detect(image);

    // Scale factor to fit the bounding boxes correctly
    const scaleX = canvas.width / image.naturalWidth;
    const scaleY = canvas.height / image.naturalHeight;

    // Keep track of detected objects
    let detectedObjects = [];

    // Draw bounding boxes and labels on canvas
    predictions.forEach(prediction => {
        if (commonObjects.includes(prediction.class)) {
            const [x, y, width, height] = prediction.bbox;
            ctx.beginPath();
            ctx.rect(x * scaleX, y * scaleY, width * scaleX, height * scaleY);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'red';
            ctx.stroke();
            ctx.fillStyle = 'red';
            ctx.font = '15px Arial';
            ctx.fillText(`${prediction.class} (${Math.round(prediction.score * 100)}%)`, x * scaleX, y * scaleY > 10 ? (y * scaleY) - 10 : 10);
            detectedObjects.push(prediction.class);
        }
    });

    // Identify objects that were not detected
    const undetectedObjects = commonObjects.filter(obj => !detectedObjects.includes(obj));

    if (undetectedObjects.length > 0) {
        console.warn("The following common objects were not detected:", undetectedObjects);
    }
}
