import type { CSSProperties, PropType } from "vue"

export type MdiIconProps = {
  path: string
  size?: number | string
  style?: CSSProperties
  color?: string
  rotate?: number
  spin?: number | boolean | "false" | "true"
  horizontal?: boolean
  vertical?: boolean
  pathAttrs?: any
}

export function MdiIcon(props: MdiIconProps & { inStack?: boolean }) {
  const {
    inStack,
    path,
    size,
    style,
    color,
    rotate,
    spin,
    horizontal,
    vertical,
    pathAttrs,
    ...rest
  } = props

  const transform = []
  const _style: CSSProperties = {}
  const pathStyle: Record<string, unknown> = {}

  if (color) pathStyle.fill = color

  if (typeof size === "string" && size.endsWith("px")) {
    _style.width = size
  } else {
    transform.push(`scale(${size})`)
    _style.width = _style.height = `${Number(size) * 1.5}rem`
  }

  horizontal && transform.push("scaleX(-1)")
  vertical && transform.push("scaleY(-1)")
  rotate !== 0 && transform.push(`rotate(${rotate}deg)`)

  const pathEl = (<path d={path} style={pathStyle} {...pathAttrs} />)
  let transformEl = pathEl
  if (transform.length) {
    _style.transform = transform.join(" ")
    _style.transformOrigin = "center"

    if (inStack) {
      transformEl = (
        <g style={_style}>
          {pathEl}
          <rect width="24" height="24" fill="transparent" />
        </g>
      )
    }
  }

  let spinEl = transformEl
  const spinSec = spin === true || spin === "true" ? 2 : Number.isNaN(Number(spin)) && spin !== "false" ? 0 : Number(spin)

  let inverse = !inStack && (horizontal || vertical)
  if (spinSec < 0) inverse = !inverse

  if (spinSec) {
    spinEl = (
      <g style={{
        animation: `spin${inverse ? "-inverse" : ""} linear ${Math.abs(spinSec)}s infinite`,
        transformOrigin: "center"
      }}
      >
        {transformEl}
        {!(horizontal || vertical || rotate !== 0) && (
          <rect width="24" height="24" fill="transparent" />
        )}
      </g>
    )
  }
  if (inStack) return () => spinEl


  return <svg
    viewBox={"0 0 24 24"}
    style={{ ...style, ..._style }}
    {...rest}
  >
    {
      spin && (
        inverse ?
          <style>{"@keyframes spin-inverse { to { transform: rotate(-360deg) } }"}</style>
          :
          <style>{"@keyframes spin { to { transform: rotate(360deg) } }"}</style>
      )
    }
    {spinEl}
  </svg>
}

MdiIcon.props = {
  path: { type: String, required: true },
  color: { type: String, default: "" },
  rotate: { type: Number, default: 0 },
  horizontal: { type: Boolean, default: false },
  vertical: { type: Boolean, default: false },
  spin: { type: [Boolean, Number, String], default: 0 },
  inStack: { type: Boolean, default: false },
  style: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  },
  size: {
    type: [Number, String],
    default: 1
  },
  pathAttrs: {
    type: Object,
    default: () => ({})
  }
}

// export function WithMdiIconProps(_props: Partial<MdiIconProps>) {
//   function IconWithProps(props: Partial<MdiIconProps>) {
//     if (!props.path && !_props.path) console.warn("mdi-icon component miss required prop \"path\"shims.d.ts")
//     // @ts-ignore
//     return (
//       <MdiIcon
//         path={props.path || _props.path || ""}  {...mergeProps(_props, props)} />
//     )
//   }
//
//   IconWithProps.props = MdiIcon.props
//   return IconWithProps
// }
