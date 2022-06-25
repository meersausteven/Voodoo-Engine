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
* Transform:
 * Position
 * Rotation
 * Every GameObject has one
* Camera:
 * Used for view rendering
* Colliders:
 * Circle Collider
 * Box Collider
 * Capsule Collider (two circle and one box collider in one constructor)
* Rigidbody:
 * Velocity and friction calculation
* Renderers:
 * Box Renderer (simple rectangle)
 * Circle Renderer (simple circle)
 * Sprite Renderer (image)
* Animation:
 * Uses a Sprite Renderer and switches the image source in a configurable time span

**Currently working on:**
* Adding necessary features to the editor
* Separating project from editor
* Move all rendering to a separate Renderer class

**Planned features:**
* Separated Axis collision system
* Rigidbody force and impact calculation
* Grid system for different positioning e.g. isometric games
* Simple Particle System
* Animation editor
* Sprite editor
* Script editor for creation and editing of own JS-files
