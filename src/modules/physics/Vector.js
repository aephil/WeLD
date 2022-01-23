export const translate = function(translation, v) {
    return {x:v.x+translation.x, y:v.y+translation.y, z:v.z+translation.z };
}

export const normalise = function(v) {
    const norm = this.norm(v);
    if (norm === 0) { return v; }
    v.x /= norm;
    v.y /= norm;
    v.z /= norm;
    return v;
}

export const scale = function(scalar, v) {
    return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
}

export const angle = function(v1, v2) {
    const denom = this.norm(v1) * this.norm(v2)
    const num = (this.dot(v1, v2))
    return Math.acos(num / (denom === 0 ? 2 * Math.pi : denom));
}

export const v3 = function(a = 0, b = 0, c = 0) {
    return { x: a, y: b, z: c };
}

export const dot = function(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

export const norm = function(v1) {
    return Math.sqrt(dot(v1, v1))
}

export const add = function(v1, v2) {
    const x = v1.x + v2.x
    const y = v1.y + v2.y
    const z = v1.z + v2.z
    return {x, y, z};
}

export const sub = function(v1, v2) {
    const x = v1.x - v2.x
    const y = v1.y - v2.y
    const z = v1.z - v2.z
    return {x, y, z};
}

export const cross = function(v1, v2) {
    const x = (v1.y * v2.z) - (v1.z * v2.y);
    const y = (v1.z * v2.x) - (v1.x * v2.z);
    const z = (v1.x * v2.y) - (v1.y * v2.x);
    return {x, y, z};
}

export const distance = function(v1, v2) {
    return norm(sub(v1, v2))
}

export const unitVector = function(v) {
    const n = norm(v);
    const u = scale(1 / n, v)
    return u;
}

export const Vector = {
    normalise, scale, angle, v3,
    dot, norm, add, sub,
    cross, distance, unitVector,
    translate,
}

export default Vector;
