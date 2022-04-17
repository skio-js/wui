import { FunctionalComponent } from "vue"

export const MdiTest: FunctionalComponent<{ path: string; color: string }> = (props) => (
  <h1 style={{ color: props.color }}>
    Hello tsx
    {props.path}
  </h1>
)
