# 2D-Engine made in Vanilla JS | ©meersausteven

This engine is heavily inspired by the Unity3D C#-based game engine.
This is not supposed to be a rather crude attempt at creating a simple engine I can use in the future for myself to make other JS-projects easier.
It's based on GameObjects and Components similiar to Unity3D, but is restricted to 2D games. I don't intend to expand this engine to support the 3rd dimension.

**Current functionalities:**
* Vector2 Class for easier use of the 2D-Canvas
* Global Time variable with different attributes (Time since last frame update etc.)
* Scene Classes that store their own GameObjects
* GameObjects that store their own Components
* Project that store their own list of scenes and their GameObjects
 * Project settings
* Global Key-Input tracking

**Current list of components:**
* Colliders:
 * Circle Collider
 * Box Collider
 * Capsule Collider (two circle and one box collider in one constructor)
 * All Colliders can be set as triggers
* Rigidbody:
 * Velocity and friction calculation
* Renderers:
 * Box Renderer (with color and border)
 * Circle Renderer (with color and border)
 * Sprite Renderer (renders an image)
* Animation:
 * Uses a Sprite Renderer and switches the image source in a configurable time span


**Currently working on:**
* Polygon Collider
* Grid System for world positioning
* Separated editor and play mode
* Saving projects as JSON-files
* Simple Particle System
* Custom Events for Callbacks
