import { Bold, IconButton, IconSwap16, Muted, Text } from "@create-figma-plugin/ui";
import { h } from "preact";
import styles from "./Header.module.css";
import { emit } from "@create-figma-plugin/utilities";
import { PrepareExportHandler } from '../types';

export function Header() {
  const refreshHandler = () => {
    emit<PrepareExportHandler>("PREPARE_EXPORT");
  }

  return (
      <div className={ styles.header }>
          <Text className={ styles.headerTitle }>
            <Bold>
              <Muted>
                Collections
              </Muted>
            </Bold>
          </Text>
          <IconButton onClick={ refreshHandler }>
            <IconSwap16 />
          </IconButton>
      </div>
  )
}