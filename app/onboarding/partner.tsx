import { router } from "expo-router";
import { View } from "react-native";
import { useState } from "react";
import { RelationshipType } from "@/src/domain/models";
import { partnerRepo } from "@/src/db/repositories/partnerRepo";
import { id, nowUtcISO } from "@/src/utils/dates";
import { Field, Panel, Pill, PrimaryButton, Screen, SectionTitle } from "@/src/components/ui";

const relationshipTypes: RelationshipType[] = ["wife", "girlfriend", "partner", "fiancee", "other"];

export default function PartnerSetup() {
  const [displayName, setDisplayName] = useState("");
  const [relationshipType, setRelationshipType] = useState<RelationshipType>("wife");
  const [birthday, setBirthday] = useState("");
  const [anniversary, setAnniversary] = useState("");
  const [firstMetDate, setFirstMetDate] = useState("");

  async function save() {
    const now = nowUtcISO();
    await partnerRepo.save({
      id: id("partner"),
      displayName: displayName.trim() || "Partner",
      relationshipType,
      birthday: birthday || undefined,
      anniversary: anniversary || undefined,
      firstMetDate: firstMetDate || undefined,
      createdAt: now,
      updatedAt: now
    });
    router.push("/onboarding/dates");
  }

  return (
    <Screen>
      <SectionTitle eyebrow="Setup" title="Partner Profile" subtitle="Add only what helps you remember and show up better." />
      <Panel>
        <Field label="Partner name or nickname" value={displayName} onChangeText={setDisplayName} placeholder="Alex" />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {relationshipTypes.map((type) => (
            <Pill key={type} label={type} selected={relationshipType === type} onPress={() => setRelationshipType(type)} />
          ))}
        </View>
        <Field label="Birthday (YYYY-MM-DD)" value={birthday} onChangeText={setBirthday} placeholder="1990-06-15" />
        <Field label="Anniversary (YYYY-MM-DD)" value={anniversary} onChangeText={setAnniversary} placeholder="2020-09-05" />
        <Field label="First met date (YYYY-MM-DD)" value={firstMetDate} onChangeText={setFirstMetDate} placeholder="2018-03-12" />
        <PrimaryButton label="Continue" onPress={save} />
      </Panel>
    </Screen>
  );
}
